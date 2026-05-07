import { createRequire } from "node:module";

import { buildJazzInspectorLink } from "./jazzInspectorLink";

import type { JazzPluginOptions, ViteDevServer } from "jazz-tools/dev/vite";

const LOG_PREFIX = "[jazz]";

function loadEnvFileIntoProcessEnv(envRoot: string): void {
  try {
    const dotenvPath = createRequire(import.meta.url).resolve("dotenv");
    const { config } = createRequire(import.meta.url)(dotenvPath) as {
      config: (options: {
        path: string;
        processEnv: NodeJS.ProcessEnv;
        override: boolean;
        quiet: boolean;
      }) => void;
    };

    config({
      path: `${envRoot}/.env`,
      processEnv: process.env,
      override: false,
      quiet: true,
    });
  } catch {
    // Best-effort env hydration for local dev parity.
  }
}

async function importJazzViteInternals(): Promise<{
  ManagedDevRuntime: new (envKeys: {
    appId: string;
    serverUrl: string;
    telemetryCollectorUrl?: string;
  }) => {
    initialize(options: JazzPluginOptions & { schemaDir: string; onSchemaPush?: () => void }): Promise<{
      appId: string;
      serverUrl: string;
      adminSecret: string;
      telemetryCollectorUrl?: string;
    }>;
    dispose(): Promise<void>;
  };
  resolveJazzWasmEntry: () => string | null;
}> {
  const jazzToolsPackageJsonPath = createRequire(import.meta.url).resolve("jazz-tools/package.json");
  const jazzToolsDirPath = jazzToolsPackageJsonPath.slice(0, jazzToolsPackageJsonPath.length - "/package.json".length);
  const viteModuleUrl = new URL(`${jazzToolsDirPath}/dist/dev/vite.js`, "file://").href;
  const managedRuntimeModuleUrl = new URL(`${jazzToolsDirPath}/dist/dev/managed-runtime.js`, "file://").href;

  const [{ resolveJazzWasmEntry }, { ManagedDevRuntime }] = await Promise.all([
    import(viteModuleUrl),
    import(managedRuntimeModuleUrl),
  ]);

  return {
    ManagedDevRuntime,
    resolveJazzWasmEntry,
  };
}

export function jazzInspectorPlugin(options: JazzPluginOptions = {}) {
  let runtimePromise: ReturnType<typeof importJazzViteInternals> | null = null;

  async function getRuntimePromise() {
    runtimePromise ??= importJazzViteInternals();
    return runtimePromise;
  }

  return {
    name: "jazz-inspector",

    async config(config: {
      ssr?: { external?: true | string[] };
      optimizeDeps?: { exclude?: string[] };
    }) {
      const existingSsr = config.ssr?.external;
      const existingExclude = config.optimizeDeps?.exclude ?? [];
      const { resolveJazzWasmEntry } = await getRuntimePromise();
      const jazzWasmEntry = resolveJazzWasmEntry();
      const ssrExternal =
        existingSsr === true ? true : Array.from(new Set([...(existingSsr ?? []), "jazz-napi"]));

      return {
        worker: { format: "es" as const },
        optimizeDeps: { exclude: Array.from(new Set([...existingExclude, "jazz-wasm"])) },
        ssr: { external: ssrExternal },
        ...(jazzWasmEntry !== null
          ? { resolve: { alias: [{ find: /^jazz-wasm$/, replacement: jazzWasmEntry }] } }
          : {}),
      };
    },

    async configureServer(viteServer: ViteDevServer) {
      if (viteServer.config.command !== "serve") {
        return;
      }

      if (options.server === false) {
        return;
      }

      loadEnvFileIntoProcessEnv(viteServer.config.root);

      const { ManagedDevRuntime } = await getRuntimePromise();
      const runtime = new ManagedDevRuntime({
        appId: "VITE_JAZZ_APP_ID",
        serverUrl: "VITE_JAZZ_SERVER_URL",
        telemetryCollectorUrl: "VITE_JAZZ_TELEMETRY_COLLECTOR_URL",
      });

      const schemaDir = options.schemaDir ?? viteServer.config.root;

      let managed:
        | {
            appId: string;
            serverUrl: string;
            adminSecret: string;
            telemetryCollectorUrl?: string;
          }
        | undefined;

      try {
        managed = await runtime.initialize({
          ...options,
          schemaDir,
          onSchemaPush: () => {
            viteServer.ws.send({ type: "full-reload" });
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        viteServer.ws.send({
          type: "error",
          err: {
            message: `${LOG_PREFIX} initialization failed: ${message}`,
            stack: error instanceof Error ? error.stack : undefined,
          },
        });
        return;
      }

      viteServer.config.env ??= {};
      viteServer.config.env.VITE_JAZZ_APP_ID = managed.appId;
      viteServer.config.env.VITE_JAZZ_SERVER_URL = managed.serverUrl;
      if (managed.telemetryCollectorUrl !== undefined) {
        viteServer.config.env.VITE_JAZZ_TELEMETRY_COLLECTOR_URL = managed.telemetryCollectorUrl;
      }

      console.log(
        `${LOG_PREFIX} Open the inspector: ${buildJazzInspectorLink(
          managed.serverUrl,
          managed.appId,
          managed.adminSecret,
        )}`,
      );

      viteServer.httpServer?.once("close", async () => {
        await runtime.dispose();
      });
    },
  };
}
