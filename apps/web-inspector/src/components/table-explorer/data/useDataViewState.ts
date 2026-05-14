import { useMemo } from "react";

import type { Table } from "@tanstack/react-table";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDescriptor, DynamicTableRow } from "jazz-tools";

import { useInspector } from "@/components/providers/inspectorProvider";
import { useDataGrid } from "@/components/table-explorer/data/useDataGrid";
import { useInspectorColumnVisibility } from "@/hooks/useInspectorColumnVisibility";
import { useInspectorRowEditor } from "@/hooks/useInspectorRowEditor";
import { useTableExplorerSearchParams } from "@/hooks/useTableExplorerSearchParams";
import { useTableMutations } from "@/hooks/useTableMutations";
import { useTableQuery } from "@/hooks/useTableQuery";
import { useTableSelection } from "@/hooks/useTableSelection";
import { appRoutes } from "@/lib/navigation/appRoutes";
import { getFieldReadOnlyReason } from "@/lib/table-explorer/mutationParsing";
import { getTableColumns } from "@/lib/table-explorer/tableSchema";
import type { DetailPaneMode, InspectorRowEditorMode, TableRowId } from "@/types/tableExplorer";

interface UseDataViewStateOptions {
  forcedDetailPaneMode: DetailPaneMode | null;
  tableName: string;
}

interface DataViewRowEditorState {
  activeRowId: TableRowId | null;
  activeRowIndex: number;
  editedRowIds: TableRowId[];
  goToNextRow: () => void;
  goToPreviousRow: () => void;
  isOpen: boolean;
  mode: InspectorRowEditorMode;
  openInsert: () => void;
}

interface UseDataViewStateResult {
  fetchMore: () => void;
  handleDelete: (() => Promise<void>) | undefined;
  handleEditSave: (values: Record<string, unknown>) => Promise<void>;
  handleInsertSave: (values: Record<string, unknown>) => Promise<void>;
  handleRowEditorOpenChange: (open: boolean) => void;
  hasMore: boolean;
  isFetchingMore: boolean;
  loadedRowCount: number;
  rowEditor: DataViewRowEditorState;
  rowValues: Record<string, unknown> | null;
  schemaColumns: ColumnDescriptor[];
  table: Table<DynamicTableRow>;
}

function createInsertRowValues(schemaColumns: ColumnDescriptor[]): Record<string, unknown> {
  return Object.fromEntries(
    schemaColumns.map((column) => {
      const readOnlyReason = getFieldReadOnlyReason(column);
      const initialValue = readOnlyReason === "binary" && column.column_type.type === "Bytea" ? new Uint8Array() : undefined;

      return [column.name, initialValue];
    }),
  );
}

export function useDataViewState({
  forcedDetailPaneMode,
  tableName,
}: UseDataViewStateOptions): UseDataViewStateResult {
  const navigate = useNavigate();
  const { currentBranch, currentConnectionId, currentSchemaHash, runtime } = useInspector();
  const searchState = useTableExplorerSearchParams();
  const query = useTableQuery({ tableName });
  const schemaColumns = useMemo(() => getTableColumns(runtime.wasmSchema, tableName), [runtime.wasmSchema, tableName]);
  const validRowIds = useMemo(() => query.rows.map((row) => String(row.id)), [query.rows]);
  const selection = useTableSelection({ validRowIds });
  const rowEditor = useInspectorRowEditor();
  const mutations = useTableMutations(tableName);
  const tableKey = `${currentConnectionId ?? "unknown"}:${currentBranch ?? "unknown"}:${currentSchemaHash ?? "unknown"}:${tableName}`;
  const columnIds = useMemo(() => query.columns.map((column) => column.id), [query.columns]);
  const visibility = useInspectorColumnVisibility({
    tableKey,
    columnIds,
  });

  const handleSelectedRowIdsChange = (nextSelectedRowIds: TableRowId[]) => {
    selection.setSelectedRowIds(nextSelectedRowIds);

    if (nextSelectedRowIds.length === 0) {
      rowEditor.close();
      return;
    }

    rowEditor.openEdit(nextSelectedRowIds);
  };

  const table = useDataGrid({
    rows: query.rows,
    columns: query.columns,
    sortColumn: searchState.sortColumn,
    sortDirection: searchState.sortDirection,
    selectedRowIds: selection.selectedRowIds,
    columnVisibility: visibility.columnVisibility,
    onSortChange: searchState.setSorting,
    onSelectedRowIdsChange: handleSelectedRowIdsChange,
    onColumnVisibilityChange: visibility.setColumnVisibility,
  });
  const selectedRow = useMemo(() => {
    return query.rows.find((row) => String(row.id) === rowEditor.activeRowId) ?? null;
  }, [query.rows, rowEditor.activeRowId]);
  const rowValues = useMemo(() => {
    if (rowEditor.mode === "insert") {
      return createInsertRowValues(schemaColumns);
    }

    return selectedRow;
  }, [rowEditor.mode, schemaColumns, selectedRow]);

  const closeDetailPane = () => {
    if (
      forcedDetailPaneMode === "edit" &&
      currentConnectionId !== null &&
      currentBranch !== null &&
      currentSchemaHash !== null
    ) {
      void navigate({
        to: appRoutes.table,
        params: {
          branch: currentBranch,
          connectionId: currentConnectionId,
          schemaHash: currentSchemaHash,
          tableName,
        },
      });
      return;
    }

    selection.clearSelection();
    rowEditor.close();
  };

  const openInsert = () => {
    selection.clearSelection();
    rowEditor.openInsert();
  };

  const handleDelete = rowEditor.mode === "edit" && rowEditor.activeRowId !== null
    ? async () => {
        const activeRowId = rowEditor.activeRowId;

        if (activeRowId === null) {
          return;
        }

        await mutations.deleteRow(activeRowId);
        const nextSelectedRowIds = selection.selectedRowIds.filter((rowId) => rowId !== activeRowId);
        handleSelectedRowIdsChange(nextSelectedRowIds);

        if (nextSelectedRowIds.length === 0) {
          closeDetailPane();
          return;
        }

        const nextActiveRowIndex = Math.min(rowEditor.activeRowIndex, nextSelectedRowIds.length - 1);
        rowEditor.openEdit(nextSelectedRowIds, nextActiveRowIndex);
      }
    : undefined;

  const resolvedRowEditorMode: InspectorRowEditorMode =
    forcedDetailPaneMode === "edit" && rowEditor.mode === "closed" ? "edit" : rowEditor.mode;

  return {
    table,
    loadedRowCount: query.loadedRowCount,
    hasMore: query.hasMore,
    isFetchingMore: query.isFetchingMore,
    fetchMore: query.fetchMore,
    schemaColumns,
    rowValues,
    rowEditor: {
      activeRowId: rowEditor.activeRowId,
      activeRowIndex: rowEditor.activeRowIndex,
      editedRowIds: rowEditor.editedRowIds,
      goToNextRow: rowEditor.goToNextRow,
      goToPreviousRow: rowEditor.goToPreviousRow,
      isOpen: forcedDetailPaneMode === "edit" ? true : rowEditor.isOpen,
      mode: resolvedRowEditorMode,
      openInsert,
    },
    handleRowEditorOpenChange: (open) => {
      if (open === false) {
        closeDetailPane();
      }
    },
    handleDelete,
    handleEditSave: async (values) => {
      if (rowEditor.activeRowId !== null) {
        await mutations.updateRow(rowEditor.activeRowId, values);
      }
    },
    handleInsertSave: async (values, options) => {
      await mutations.insertRow(values);
      query.resetLoadedRows();

      if (options?.keepOpen === true) {
        rowEditor.openInsert();
        return;
      }

      closeDetailPane();
    },
  };
}
