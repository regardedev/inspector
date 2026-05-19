import { Link, useMatchRoute } from "@tanstack/react-router";
import { CodeXml, TableProperties } from "lucide-react";

import { Button } from "@regarde/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@regarde/ui/tooltip";
import { cn } from "@regarde/ui/lib/utils";

import { useInspector } from "@/components/providers/inspectorProvider";
import { inspectorRailWidthClassName } from "#/layout/inspectorShell";
import { appRoutes } from "@/lib/navigation/appRoutes";

export function InspectorRail(): React.ReactElement {
  const matchRoute = useMatchRoute();
  const { currentBranch, currentConnectionId, currentSchemaHash } = useInspector();

  const routeParams =
    currentConnectionId !== null && currentBranch !== null && currentSchemaHash !== null
      ? {
          branch: currentBranch,
          connectionId: currentConnectionId,
          schemaHash: currentSchemaHash,
        }
      : null;

  const isTablesActive =
    routeParams !== null && matchRoute({ to: appRoutes.tables, params: routeParams, fuzzy: true }) !== false;

  const isLiveQueryActive =
    routeParams !== null && matchRoute({ to: appRoutes.liveQuery, params: routeParams, fuzzy: true }) !== false;

  return (
    <aside
      className={cn(
        "flex min-h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        inspectorRailWidthClassName,
      )}
    >
      <nav aria-label="Inspector navigation" className="flex flex-1 flex-col items-center gap-1 px-1.5 py-2">
        <Tooltip>
          <TooltipTrigger
            render={
              routeParams !== null ? (
              <Button
                variant={isTablesActive === true ? "default" : "ghost"}
                size="icon-sm"
                nativeButton={false}
                render={<Link to={appRoutes.tables} params={routeParams} />}
                aria-current={isTablesActive === true ? "page" : undefined}
              >
                <TableProperties />
                <span className="sr-only">Tables</span>
              </Button>
              ) : (
              <Button type="button" variant="ghost" size="icon-sm" disabled>
                <TableProperties />
                <span className="sr-only">Tables</span>
              </Button>
              )
            }
          />
          <TooltipContent side="right">Tables</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              routeParams !== null ? (
              <Button
                variant={isLiveQueryActive === true ? "default" : "ghost"}
                size="icon-sm"
                nativeButton={false}
                render={<Link to={appRoutes.liveQuery} params={routeParams} />}
                aria-current={isLiveQueryActive === true ? "page" : undefined}
              >
                <CodeXml />
                <span className="sr-only">Live Query</span>
              </Button>
              ) : (
              <Button type="button" variant="ghost" size="icon-sm" disabled>
                <CodeXml />
                <span className="sr-only">Live Query</span>
              </Button>
              )
            }
          />
          <TooltipContent side="right">Live Query</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}
