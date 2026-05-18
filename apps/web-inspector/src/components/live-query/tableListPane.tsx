import { Input } from "@regarde/ui/input";
import { Badge } from "@regarde/ui/badge";
import { SidePanel } from "@regarde/ui/sidePanel";
import { EmptyState } from "@regarde/ui/emptyState";
import { cn } from "@regarde/ui/lib/utils";

import { inspectorListPaneWidthClassName } from "#/layout/inspectorShell";
import type { LiveQueryTableItem } from "@/types/liveQuery";

interface LiveQueryListPaneProps {
  isInitialLoading: boolean;
  listSearchValue: string;
  selectedTableName: string | null;
  visibleTableItems: LiveQueryTableItem[];
  onListSearchValueChange: (value: string) => void;
  onSelectedTableNameChange: (value: string | null) => void;
}

export function LiveQueryListPane({
  isInitialLoading,
  listSearchValue,
  selectedTableName,
  visibleTableItems,
  onListSearchValueChange,
  onSelectedTableNameChange,
}: LiveQueryListPaneProps): React.ReactElement {
  const liveQueryListPane = SidePanel.useSidePanel();
  const shouldShowEmptyState = isInitialLoading === false && visibleTableItems.length === 0;
  const emptyStateDescription =
    listSearchValue.trim().length === 0 ? "No active server subscriptions found." : "Try a different table search.";

  return (
    <SidePanel
      side="left"
      widthClassName={inspectorListPaneWidthClassName}
      className={cn(
        "border-r bg-background",
        liveQueryListPane.open === true ? "border-border" : "border-none",
      )}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="border-b border-border px-1 py-1">
          <Input
            value={listSearchValue}
            onChange={(event) => {
              onListSearchValueChange(event.currentTarget.value);
            }}
            placeholder="Search tables..."
            variant="ghost"
            className="h-8 text-base"
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
                "flex min-h-8 items-center justify-between rounded-xs px-3 text-sm text-foreground",
                selectedTableName === null ? "bg-muted" : "hover:bg-muted/60",
              )}
            >
              <span className="truncate">All tables</span>
            </button>
            {isInitialLoading === true ? null : shouldShowEmptyState === true ? (
              <EmptyState title="No tables found" description={emptyStateDescription} />
            ) : (
              visibleTableItems.map((tableItem) => {
                const isActive = selectedTableName === tableItem.tableName;

                return (
                  <button
                    key={tableItem.tableName}
                    type="button"
                    onClick={() => {
                      onSelectedTableNameChange(tableItem.tableName);
                    }}
                    className={cn(
                      "flex min-h-8 items-center justify-between rounded-xs px-3 text-sm text-foreground",
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
