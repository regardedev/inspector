import type { ColumnDescriptor } from "jazz-tools";

import type { TableFilterClause } from "@/types/tableFilters";

export type TableExplorerView = "data" | "schema";

export type DetailPaneMode = "edit" | "insert";

export type TableSortDirection = "asc" | "desc";

export type TableRowId = string;

export interface TableExplorerSearchState {
  view: TableExplorerView;
  filters: TableFilterClause[];
  sortColumn: string;
  sortDirection: TableSortDirection;
}

export type TableColumnVisibilityState = Record<string, boolean>;

export type InspectorRowEditorState =
  | { kind: "closed" }
  | { kind: "insert" }
  | {
      kind: "edit";
      editedRowIds: TableRowId[];
      activeRowIndex: number;
    };

export type InspectorRowEditorMode = InspectorRowEditorState["kind"];

export interface TableColumnMeta {
  id: string;
  label: string;
  accessorKey: string;
  column: ColumnDescriptor | null;
  isSortable: boolean;
  width?: string;
}
