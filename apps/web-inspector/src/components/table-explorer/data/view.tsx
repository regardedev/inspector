import { Button } from "@regarde/ui/button";

import { ActionsBar } from "@/components/table-explorer/actionsBar";
import { DataGrid } from "@/components/table-explorer/data/dataGrid";
import { DataGridToolbar } from "@/components/table-explorer/data/dataGridToolbar";
import { RowEditorForm } from "@/components/table-explorer/data/rowEditorForm";
import { RowEditorSidePanel } from "@/components/table-explorer/data/rowEditorSidePanel";
import { useDataViewState } from "@/components/table-explorer/data/useDataViewState";
import type { DetailPaneMode, TableExplorerView } from "@/types/tableExplorer";

interface DataViewProps {
  forcedDetailPaneMode?: DetailPaneMode | null;
  onViewChange: (view: TableExplorerView) => Promise<void>;
  tableName: string;
  view: TableExplorerView;
}

export function DataView({
  forcedDetailPaneMode = null,
  onViewChange,
  tableName,
  view,
}: DataViewProps): React.ReactElement {
  const state = useDataViewState({
    forcedDetailPaneMode,
    tableName,
  });

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-background">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ActionsBar
          view={view}
          onViewChange={onViewChange}
          leftChildren={(
            <Button type="button" variant="secondary" size="sm" onClick={state.rowEditor.openInsert}>
              Insert row
            </Button>
          )}
        >
          <DataGridToolbar table={state.table} />
        </ActionsBar>
        <div className="min-h-0 flex-1 overflow-hidden">
          <DataGrid
            table={state.table}
            loadedRowCount={state.loadedRowCount}
            hasMore={state.hasMore}
            isFetchingMore={state.isFetchingMore}
            onFetchMore={state.fetchMore}
          />
        </div>
      </div>
      <RowEditorSidePanel
        open={state.rowEditor.isOpen}
        onOpenChange={state.handleRowEditorOpenChange}
        mode={state.rowEditor.mode === "insert" ? "insert" : "edit"}
        tableName={tableName}
        editedRowIds={state.rowEditor.editedRowIds}
        activeRowIndex={state.rowEditor.activeRowIndex}
        activeRowId={state.rowEditor.activeRowId}
        rowValues={state.rowValues}
        schemaColumns={state.schemaColumns}
        onNavigatePrevious={state.rowEditor.goToPreviousRow}
        onNavigateNext={state.rowEditor.goToNextRow}
      >
        <RowEditorForm
          mode={state.rowEditor.mode === "insert" ? "insert" : "edit"}
          rowValues={state.rowValues}
          schemaColumns={state.schemaColumns}
          tableName={tableName}
          targetRowId={state.rowEditor.activeRowId}
          onCancel={() => {
            state.handleRowEditorOpenChange(false);
          }}
          onDelete={state.handleDelete}
          onSave={state.handleSave}
        />
      </RowEditorSidePanel>
    </div>
  );
}
