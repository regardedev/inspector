import { Link, useLocation } from "@tanstack/react-router";
import { CodeXml, TableProperties } from "lucide-react";

import { Button } from "@regarde/ui/button";
import { SidePanel } from "@regarde/ui/sidePanel";
import { cn } from "@regarde/ui/lib/utils";

import { useInspector } from "@/components/providers/inspectorProvider";
import { inspectorRailWidthClassName } from "#/layout/inspectorShell";
import { appRoutes } from "@/lib/navigation/appRoutes";

interface RailItem {
  icon: React.ComponentType<{ className?: string }>;
  id: string;
  isActive: (pathname: string, schemaPathname: string | null, tablesPathname: string | null) => boolean;
  title: string;
  to?: typeof appRoutes.tables | typeof appRoutes.liveQuery;
}

function getSchemaPathname(
  schemaParams:
    | {
        branch: string;
        connectionId: string;
        schemaHash: string;
      }
    | undefined,
): string | null {
  if (schemaParams === undefined) {
    return null;
  }

  return `/conn/${schemaParams.connectionId}/${schemaParams.branch}/${schemaParams.schemaHash}`;
}

function getTablesPathname(
  tablesParams:
    | {
        branch: string;
        connectionId: string;
        schemaHash: string;
      }
    | undefined,
): string | null {
  if (tablesParams === undefined) {
    return null;
  }

  return `/conn/${tablesParams.connectionId}/${tablesParams.branch}/${tablesParams.schemaHash}/tables`;
}

const railItems: RailItem[] = [
  {
    icon: TableProperties,
    id: "tables",
    isActive: (pathname, _schemaPathname, tablesPathname) => {
      if (tablesPathname === null) {
        return false;
      }

      return pathname === tablesPathname || pathname.startsWith(`${tablesPathname}/`);
    },
    title: "Tables",
    to: appRoutes.tables,
  },
  {
    icon: CodeXml,
    id: "live-query",
    isActive: (pathname, schemaPathname) => {
      if (schemaPathname === null) {
        return false;
      }

      return pathname === `${schemaPathname}/live-query` || pathname.startsWith(`${schemaPathname}/live-query/`);
    },
    title: "Live Query",
    to: appRoutes.liveQuery,
  },
];

export function InspectorRail(): React.ReactElement {
  const location = useLocation();
  const tableListPane = SidePanel.useSidePanel();
  const { currentBranch, currentConnectionId, currentSchemaHash } = useInspector();

  const tablesParams =
    currentConnectionId !== null && currentBranch !== null && currentSchemaHash !== null
      ? {
          branch: currentBranch,
          connectionId: currentConnectionId,
          schemaHash: currentSchemaHash,
        }
      : undefined;
  const schemaPathname = getSchemaPathname(tablesParams);
  const tablesPathname = getTablesPathname(tablesParams);

  return (
    <aside
      className={cn(
        "flex min-h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        inspectorRailWidthClassName,
      )}
    >
      <nav aria-label="Inspector navigation" className="flex flex-1 flex-col items-center gap-1 px-1.5 py-2">
        {railItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive(location.pathname, schemaPathname, tablesPathname);
          const isDisabled = item.to !== undefined && tablesParams === undefined;

          if (item.to !== undefined && tablesParams !== undefined && isDisabled === false) {
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon-sm"
                nativeButton={false}
                render={<Link to={item.to} params={tablesParams} />}
                title={item.title}
                className={cn(
                  "rounded-lg border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive === true ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground" : "",
                )}
                onClick={() => {
                  tableListPane.onOpenChange(true);
                }}
              >
                <Icon />
                <span className="sr-only">{item.title}</span>
              </Button>
            );
          }

          return (
            <Button
              key={item.id}
              type="button"
              disabled={isDisabled}
              title={item.title}
              variant="secondary"
              size="icon-sm"
              className="rounded-lg border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-40"
            >
              <Icon />
              <span className="sr-only">{item.title}</span>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
