import { Link } from "@tanstack/react-router";

import { useInspector } from "@/components/providers/inspectorProvider";
import { appRoutes } from "@/lib/navigation/appRoutes";

export function NewConnectionPage(): React.ReactElement {
  const { prefill } = useInspector();

  return (
    <main className="min-h-screen bg-white px-10 py-6 text-zinc-950">
      <section className="mx-auto min-h-[42rem] max-w-6xl p-10">
        <div className="grid min-h-[36rem] gap-8 lg:grid-cols-[minmax(0,1fr)_30rem]">
          <section className="space-y-12">
            <div>
              <Link to={appRoutes.connections} className="text-sm text-zinc-700 hover:text-zinc-900">
                Open Connections
              </Link>
            </div>
            <div className="space-y-3 text-sm text-zinc-700">
              <div>Connection creation flow lives here.</div>
              <div>Keep this route focused on creating a saved connection, then entering the workspace.</div>
            </div>
          </section>
          <aside className="border-l border-zinc-200 pl-6">
            <div className="space-y-4 text-sm text-zinc-700">
              <h1 className="text-base font-medium text-zinc-950">Add New Connection</h1>
              {prefill !== null ? (
                <dl className="space-y-2">
                  <div>
                    <dt className="text-zinc-500">Name</dt>
                    <dd>{prefill.name || "(empty)"}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Server URL</dt>
                    <dd>{prefill.serverUrl || "(empty)"}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">App ID</dt>
                    <dd>{prefill.appId || "(empty)"}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Environment</dt>
                    <dd>{prefill.env || "(empty)"}</dd>
                  </div>
                  <div>
                    <dt className="text-zinc-500">Branch</dt>
                    <dd>{prefill.branch || "(empty)"}</dd>
                  </div>
                </dl>
              ) : (
                <p className="text-zinc-500">No connection prefill is available.</p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
