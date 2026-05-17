import { Input } from "@regarde/ui/input";
import { Badge } from "@regarde/ui/badge";
import { SidePanel } from "@regarde/ui/sidePanel";
import { cn } from "@regarde/ui/lib/utils";

import { EmptyState } from "@/components/table-explorer/emptyState";
import { inspectorListPaneWidthClassName } from "#/layout/inspectorShell";
import type { LiveQueryTableItem } from "@/types/liveQuery";

interface LiveQueryListPaneProps {
  isInitialLoading: boolean;
  searchValue: string;
  selectedTableName: string | null;
  tableItems: LiveQueryTableItem[];
  onSearchValueChange: (value: string) => void;
  onSelectedTableNameChange: (value: string | null) => void;
}

export function LiveQueryListPane({
  isInitialLoading,
  searchValue,
  selectedTableName,
  tableItems,
  onSearchValueChange,
  onSelectedTableNameChange,
}: LiveQueryListPaneProps): React.ReactElement {
  const liveQueryListPane = SidePanel.useSidePanel();
  const shouldShowEmptyState = isInitialLoading === false && tableItems.length === 0;
  const emptyStateDescription =
    searchValue.trim().length === 0 ? "No active server subscriptions found." : "Try a different table search.";

  return (
    <SidePanel
      side="left"
      widthClassName={inspectorListPaneWidthClassName}
      className={liveQueryListPane.open === true ? "border-r border-border bg-background" : "border-r border-transparent bg-background"}
    >
      <div className={cn("flex h-full min-h-0 flex-col bg-background", inspectorListPaneWidthClassName)}>
        <div className="border-b border-border px-1 py-1">
          <Input
            value={searchValue}
            onChange={(event) => {
              onSearchValueChange(event.currentTarget.value);
            }}
            placeholder="Search tables..."
            className="h-8 border-none bg-transparent text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-2">
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => {
                onSelectedTableNameChange(null);
              }}
              className={cn(
                "flex min-h-8 items-center justify-between gap-2 rounded-xs px-3 text-sm text-foreground",
                selectedTableName === null ? "bg-muted" : "hover:bg-muted/60",
              )}
            >
              <span className="truncate">All tables</span>
            </button>
            {isInitialLoading === true ? null : shouldShowEmptyState === true ? (
              <EmptyState title="No tables found" description={emptyStateDescription} />
            ) : (
              tableItems.map((tableItem) => {
                const isActive = selectedTableName === tableItem.tableName;

                return (
                  <button
                    key={tableItem.tableName}
                    type="button"
                    onClick={() => {
                      onSelectedTableNameChange(tableItem.tableName);
                    }}
                    className={cn(
                      "flex min-h-8 items-center justify-between gap-2 rounded-xs px-3 text-sm text-foreground",
                      isActive === true ? "bg-muted" : "hover:bg-muted/60",
                    )}
                  >
                    <span className="truncate">{tableItem.tableName}</span>
                    <Badge variant="secondary" size="sm">{tableItem.subscriptionCount}</Badge>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </SidePanel>
  );
}
