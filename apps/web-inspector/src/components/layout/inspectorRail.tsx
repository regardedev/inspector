import { Link, useLocation } from "@tanstack/react-router";
import { CodeXml, TableProperties } from "lucide-react";

import { Button } from "@regarde/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@regarde/ui/tooltip";
import { cn } from "@regarde/ui/lib/utils";

import { useInspector } from "@/components/providers/inspectorProvider";
import { inspectorRailWidthClassName } from "#/layout/inspectorShell";
import { appRoutes } from "@/lib/navigation/appRoutes";

export function InspectorRail(): React.ReactElement {
  const location = useLocation();
  const { currentBranch, currentConnectionId, currentSchemaHash } = useInspector();

  const tablesParams =
    currentConnectionId !== null && currentBranch !== null && currentSchemaHash !== null
      ? {
          branch: currentBranch,
          connectionId: currentConnectionId,
          schemaHash: currentSchemaHash,
        }
      : undefined;

  const tablesBasePath =
    tablesParams !== undefined
      ? `/conn/${tablesParams.connectionId}/${tablesParams.branch}/${tablesParams.schemaHash}/tables`
      : null;

  const isTablesActive =
    tablesBasePath !== null &&
    (location.pathname === tablesBasePath || location.pathname.startsWith(`${tablesBasePath}/`));

  const isLiveQueryActive =
    tablesBasePath !== null &&
    (location.pathname === `${tablesBasePath}/live-query` ||
      location.pathname.startsWith(`${tablesBasePath}/live-query/`));

  return (
    <aside
      className={cn(
        "flex min-h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        inspectorRailWidthClassName,
      )}
    >
      <nav aria-label="Inspector navigation" className="flex flex-1 flex-col items-center gap-1 px-1.5 py-2">
        {/* Tables */}
        <Tooltip>
          <TooltipTrigger render={null}>
            {tablesParams !== undefined ? (
              <Button
                variant="ghost"
                size="icon-sm"
                render={<Link to={appRoutes.tables} params={tablesParams} />}
                className={cn(
                  "rounded-lg border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isTablesActive === true &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                )}
              >
                <TableProperties />
                <span className="sr-only">Tables</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled
                className="rounded-lg border-transparent text-sidebar-foreground/40"
              >
                <TableProperties />
                <span className="sr-only">Tables</span>
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right">Tables</TooltipContent>
        </Tooltip>

        {/* Live Query */}
        <Tooltip>
          <TooltipTrigger render={null}>
            {tablesParams !== undefined ? (
              <Button
                variant="ghost"
                size="icon-sm"
                render={<Link to={appRoutes.liveQuery} params={tablesParams} />}
                className={cn(
                  "rounded-lg border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isLiveQueryActive === true &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                )}
              >
                <CodeXml />
                <span className="sr-only">Live Query</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled
                className="rounded-lg border-transparent text-sidebar-foreground/40"
              >
                <CodeXml />
                <span className="sr-only">Live Query</span>
              </Button>
            )}
          </TooltipTrigger>
          <TooltipContent side="right">Live Query</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
