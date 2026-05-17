import { LiveQueryGrid } from "@/components/live-query/dataGrid";
import { LiveQueryListPane } from "@/components/live-query/tableListPane";
import { useLiveQueryState } from "@/components/live-query/useLiveQueryState";

export function LiveQueryScreen(): React.ReactElement {
  const state = useLiveQueryState();
  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-background">
      <LiveQueryListPane
        isInitialLoading={state.isInitialLoading}
        searchValue={state.searchValue}
        selectedTableName={state.selectedTableName}
        tableItems={state.tableItems}
        onSearchValueChange={state.setSearchValue}
        onSelectedTableNameChange={state.setSelectedTableName}
      />
      <LiveQueryGrid state={state} />
    </div>
  );
}
