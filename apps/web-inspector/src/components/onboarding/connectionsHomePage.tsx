import { Link } from "@tanstack/react-router";

import { Button } from "@regarde/ui/button";

import { useInspector } from "@/components/providers/inspectorProvider";
import {
  getConnectionDisplayName,
  getConnectionSecondaryLabel,
} from "@/lib/config/connections";
import { appRoutes } from "@/lib/navigation/appRoutes";

interface ConnectionsSectionProps {
  title: string;
  children: React.ReactNode;
}

function ConnectionsSection({ title, children }: ConnectionsSectionProps): React.ReactElement {
  return (
    <section className="flex flex-col items-start gap-2">
      <div className="flex w-full items-center gap-3 px-1">
        <h2 className="shrink-0 text-[11px] leading-4 font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </h2>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex w-full max-w-100 flex-col items-start">
        {children}
      </div>
    </section>
  );
}

export function ConnectionsHomePage(): React.ReactElement {
  const { connections, openConnection } = useInspector();

  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-100 flex-col items-start gap-10">
        <ConnectionsSection title="Get started">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link to={appRoutes.newConnection} />}
            className="h-auto w-full justify-start rounded-xs border-transparent px-3 py-1 text-left text-sm font-normal text-foreground hover:bg-transparent"
          >
            New Connection
          </Button>
          <a
            href="https://jazz.tools/docs"
            target="_blank"
            rel="noreferrer"
            className="w-full rounded-xs px-3 py-1 text-sm text-foreground"
          >
            Jazz Documentation
          </a>
        </ConnectionsSection>

        <ConnectionsSection title="Recent connections">
          {connections.length > 0 ? (
            connections.map((connection) => (
              <Button
                key={connection.id}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  void openConnection(connection.id);
                }}
                className="h-auto w-full flex-col items-start gap-1 rounded-xs border-transparent px-3 py-1 text-left hover:bg-transparent"
              >
                <span className="text-sm text-foreground">
                  {getConnectionDisplayName(connection)}
                </span>
                <span className="text-xs leading-4 text-muted-foreground">
                  {getConnectionSecondaryLabel(connection)}
                </span>
              </Button>
            ))
          ) : (
            <div className="w-full rounded-xs px-3 py-1 text-sm text-muted-foreground">
              No saved connections yet.
            </div>
          )}
        </ConnectionsSection>
      </div>
    </div>
  );
}
