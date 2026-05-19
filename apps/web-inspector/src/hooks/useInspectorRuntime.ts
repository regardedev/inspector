import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchSchemaHashes, fetchStoredPermissions, fetchStoredWasmSchema, type StoredPermissionsResponse, type WasmSchema } from "jazz-tools";
import { createJazzClient, type JazzClient } from "jazz-tools/react";

import type { StoredConnection } from "@/lib/config/connections";

export interface InspectorRuntimeState {
  client: JazzClient | null;
  wasmSchema: WasmSchema | null;
  storedPermissions: StoredPermissionsResponse | null;
  availableSchemaHashes: string[];
  error: string | null;
  isLoading: boolean;
  clearRuntime: () => void;
}

interface UseInspectorRuntimeOptions {
  connection: StoredConnection | null;
  branch: string | null;
  schemaHash: string | null;
}

export function useInspectorRuntime({
  connection,
  branch,
  schemaHash,
}: UseInspectorRuntimeOptions): InspectorRuntimeState {
  const [client, setClient] = useState<JazzClient | null>(null);
  const [wasmSchema, setWasmSchema] = useState<WasmSchema | null>(null);
  const [storedPermissions, setStoredPermissions] = useState<StoredPermissionsResponse | null>(null);
  const [availableSchemaHashes, setAvailableSchemaHashes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearRuntime = useCallback(() => {
    setClient((currentClient) => {
      if (currentClient !== null) {
        void currentClient.shutdown();
      }
      return null;
    });
    setWasmSchema(null);
    setStoredPermissions(null);
  }, []);

  useEffect(() => {
    if (connection === null || branch === null || schemaHash === null) {
      clearRuntime();
      setAvailableSchemaHashes([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    let runtimeClient: JazzClient | null = null;

    setError(null);
    setIsLoading(true);

    const run = async () => {
      try {
        runtimeClient = await createJazzClient({
          appId: connection.appId,
          serverUrl: connection.serverUrl,
          env: connection.env,
          userBranch: branch,
          adminSecret: connection.adminSecret,
          driver: { type: "memory" },
        });

        if (active === false) {
          void runtimeClient.shutdown();
          runtimeClient = null;
          return;
        }

        const [{ schema }, { hashes }, permissions] = await Promise.all([
          fetchStoredWasmSchema(connection.serverUrl, {
            appId: connection.appId,
            adminSecret: connection.adminSecret,
            schemaHash,
          }),
          fetchSchemaHashes(connection.serverUrl, {
            appId: connection.appId,
            adminSecret: connection.adminSecret,
          }),
          fetchStoredPermissions(connection.serverUrl, {
            appId: connection.appId,
            adminSecret: connection.adminSecret,
          }).catch(() => null),
        ]);

        if (active === false) {
          if (runtimeClient !== null) {
            void runtimeClient.shutdown();
            runtimeClient = null;
          }
          return;
        }

        const nextClient = runtimeClient;

        setClient((currentClient) => {
          if (currentClient !== null) {
            void currentClient.shutdown();
          }
          return nextClient;
        });
        setWasmSchema(schema);
        setStoredPermissions(permissions);
        setAvailableSchemaHashes(hashes);
        setIsLoading(false);
      } catch (runtimeError) {
        if (runtimeClient !== null) {
          void runtimeClient.shutdown();
          runtimeClient = null;
        }

        if (active === false) {
          return;
        }

        setError(runtimeError instanceof Error ? runtimeError.message : String(runtimeError));
        setIsLoading(false);
      }
    };

    clearRuntime();
    void run();

    return () => {
      active = false;
      if (runtimeClient !== null) {
        const clientToShutdown = runtimeClient;
        runtimeClient = null;
        void clientToShutdown.shutdown();
        setClient((currentClient) => (currentClient === clientToShutdown ? null : currentClient));
      }
    };
  }, [branch, clearRuntime, connection, schemaHash]);

  return useMemo(
    () => ({
      client,
      wasmSchema,
      storedPermissions,
      availableSchemaHashes,
      error,
      isLoading,
      clearRuntime,
    }),
    [availableSchemaHashes, clearRuntime, client, error, isLoading, storedPermissions, wasmSchema],
  );
}
