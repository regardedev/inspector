import { Link } from "@tanstack/react-router";

import { Search } from "@regarde/ui/search";
import { EmptyState } from "@regarde/ui/emptyState";
import { cn } from "@regarde/ui/lib/utils";

import { useInspector } from "@/components/providers/inspectorProvider";
import { appRoutes } from "@/lib/navigation/appRoutes";

interface TableListPaneProps {
  filteredTables: string[];
  isOpen: boolean;
  searchValue: string;
  selectedTableName: string | null;
  tables: string[];
  onSearchValueChange: (value: string) => void;
}

export function TableListPane({
  filteredTables,
  isOpen,
  searchValue,
  selectedTableName,
  tables,
  onSearchValueChange,
}: TableListPaneProps): React.ReactElement {
  const { currentBranch, currentConnectionId, currentSchemaHash } = useInspector();
  const canBuildHref = currentConnectionId !== null && currentBranch !== null && currentSchemaHash !== null;

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-background", isOpen === true ? "border-r border-border" : null)}>
      <div className="flex h-10 shrink-0 items-center border-b border-border px-3">
        <Search
          value={searchValue}
          onChange={(event) => {
            onSearchValueChange(event.currentTarget.value);
          }}
          placeholder="Search tables..."
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        <div className="flex flex-col gap-1">
          {tables.length === 0 ? (
            <EmptyState title="No tables" description="No published tables found in this schema." />
          ) : filteredTables.length === 0 ? (
            <EmptyState title="No results" description="Try a different table search." />
          ) : (
            <div className="flex flex-col gap-1">
              {filteredTables.map((tableName) => {
                const isActive = selectedTableName === tableName;
                const tableParams =
                  canBuildHref === true
                    ? {
                        connectionId: currentConnectionId,
                        branch: currentBranch,
                        schemaHash: currentSchemaHash,
                        tableName,
                      }
                    : null;

                if (tableParams === null) {
                  return (
                    <div
                      key={tableName}
                      className={cn(
                        "flex min-h-7 items-center rounded-xs px-3 text-sm text-foreground",
                        isActive === true ? "bg-muted" : "hover:bg-muted/60",
                      )}
                    >
                      <span className="truncate">{tableName}</span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={tableName}
                    to={appRoutes.table}
                    params={tableParams}
                    className={cn(
                      "flex min-h-7 items-center rounded-xs px-3 text-sm text-foreground",
                      isActive === true ? "bg-muted" : "hover:bg-muted/60",
                    )}
                  >
                    <span className="truncate">{tableName}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
