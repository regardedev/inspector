import { Link } from "@tanstack/react-router";

import { useInspector } from "@/components/providers/inspectorProvider";
import {
  getConnectionDisplayName,
  getConnectionSecondaryLabel,
} from "@/lib/config/connections";
import { appRoutes } from "@/lib/navigation/appRoutes";

export function ConnPage(): React.ReactElement {
  const { connections, openConnection } = useInspector();

  return (
    <main className="min-h-screen bg-white px-10 py-6 text-zinc-950">
      <section className="mx-auto min-h-[42rem] max-w-6xl 0 p-10">
        <div className="mx-auto grid max-w-xl gap-12 pt-24">
          <section>
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <span>Get Started</span>
              <span className="h-px flex-1 bg-zinc-300" />
            </div>
            <div className="space-y-3 text-sm">
              <Link to={appRoutes.newConnection} className="block text-zinc-700 hover:text-zinc-900">
                New Connection
              </Link>
              <a
                href="https://jazz.tools/docs"
                target="_blank"
                rel="noreferrer"
                className="block text-zinc-700 hover:text-zinc-900"
              >
                Jazz Documentation
              </a>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
              <span>Recent Connections</span>
              <span className="h-px flex-1 bg-zinc-300" />
            </div>
            {connections.length > 0 ? (
              <div className="space-y-6 text-sm">
                {connections.map((connection) => (
                  <button
                    key={connection.id}
                    type="button"
                    onClick={() => {
                      void openConnection(connection.id);
                    }}
                    className="block space-y-1 text-left text-zinc-700 hover:text-zinc-900"
                  >
                    <div>{getConnectionDisplayName(connection)}</div>
                    <div className="text-zinc-500">{getConnectionSecondaryLabel(connection)}</div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No saved connections yet.</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
