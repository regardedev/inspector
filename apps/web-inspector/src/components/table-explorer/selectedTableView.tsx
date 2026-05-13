import { DataView } from "@/components/table-explorer/data/view";
import { EmptyState } from "@/components/table-explorer/emptyState";
import { SchemaView } from "@/components/table-explorer/schema/view";
import { useInspector } from "@/components/providers/inspectorProvider";
import { useTableExplorerSearchParams } from "@/hooks/useTableExplorerSearchParams";
import type { DetailPaneMode } from "@/types/tableExplorer";

interface SelectedTableViewProps {
  forcedDetailPaneMode?: DetailPaneMode | null;
  tableName: string | null;
}

export function SelectedTableView({
  forcedDetailPaneMode = null,
  tableName,
}: SelectedTableViewProps): React.ReactElement {
  const { runtime } = useInspector();
  const searchState = useTableExplorerSearchParams();

  if (tableName === null) {
    return <EmptyState title="Select a table" description="Choose a table from the list to view its content." />;
  }

  if (runtime.wasmSchema === null) {
    return <EmptyState title="Loading schema" description="Waiting for schema metadata to load." />;
  }

  if (searchState.view === "schema") {
    return <SchemaView tableName={tableName} view="schema" onViewChange={searchState.setView} />;
  }

  return (
    <DataView
      forcedDetailPaneMode={forcedDetailPaneMode}
      tableName={tableName}
      view="data"
      onViewChange={searchState.setView}
    />
  );
}
