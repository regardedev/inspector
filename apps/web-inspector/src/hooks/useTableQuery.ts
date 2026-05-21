import { useMemo, useState } from "react";

import { useAll } from "jazz-tools/react";
import { type DynamicTableRow } from "jazz-tools";

import { useInspector } from "@/components/providers/inspectorProvider";
import { useTableExplorerSearchParams } from "@/hooks/useTableExplorerSearchParams";
import { GenericQueryBuilder } from "@/lib/table-explorer/genericQueryBuilder";
import { getTableColumns } from "@/lib/table-explorer/tableSchema";
import type { TableColumnMeta } from "@/types/tableExplorer";

const DEFAULT_CHUNK_SIZE = 50;
const EMPTY_ROWS: DynamicTableRow[] = [];

function isColumnSortable(columnType: ReturnType<typeof getTableColumns>[number]["column_type"]): boolean {
  switch (columnType.type) {
    case "Integer":
    case "BigInt":
    case "Double":
    case "Boolean":
    case "Text":
    case "Enum":
    case "Timestamp":
    case "Uuid":
      return true;
    default:
      return false;
  }
}

export interface UseTableQueryOptions {
  chunkSize?: number;
  tableName: string | null;
}

export interface UseTableQueryResult {
  columns: TableColumnMeta[];
  fetchMore: () => void;
  hasMore: boolean;
  isFetchingMore: boolean;
  loadedRowCount: number;
  resetLoadedRows: () => void;
  rows: DynamicTableRow[];
}

interface RequestedRowCountState {
  queryKey: string;
  rowCount: number;
}

export function useTableQuery({
  chunkSize = DEFAULT_CHUNK_SIZE,
  tableName,
}: UseTableQueryOptions): UseTableQueryResult {
  const { currentSchemaHash, runtime } = useInspector();
  const { filters, sortColumn, sortDirection } = useTableExplorerSearchParams();
  const queryKey = useMemo(
    () => JSON.stringify({ chunkSize, currentSchemaHash, filters, sortColumn, sortDirection, tableName }),
    [chunkSize, currentSchemaHash, filters, sortColumn, sortDirection, tableName],
  );
  const [requestedRowCountState, setRequestedRowCountState] = useState<RequestedRowCountState>(() => ({
    queryKey,
    rowCount: chunkSize,
  }));
  const requestedRowCount = requestedRowCountState.queryKey === queryKey ? requestedRowCountState.rowCount : chunkSize;

  const schemaColumns = useMemo(
    () => getTableColumns(runtime.wasmSchema, tableName),
    [runtime.wasmSchema, tableName],
  );

  const columns = useMemo<TableColumnMeta[]>(() => {
    const idColumn: TableColumnMeta = {
      id: "id",
      label: "id",
      accessorKey: "id",
      column: null,
      isSortable: true,
      width: "minmax(14rem, 1.4fr)",
    };

    return [
      idColumn,
      ...schemaColumns.map((column) => ({
        id: column.name,
        label: column.name,
        accessorKey: column.name,
        column,
        isSortable: isColumnSortable(column.column_type),
        width: "minmax(10rem, 1fr)",
      })),
    ];
  }, [schemaColumns]);

  const queryBuilder = useMemo(() => {
    if (runtime.wasmSchema === null || tableName === null) {
      return null;
    }

    let builder = new GenericQueryBuilder(tableName, runtime.wasmSchema);
    for (const filter of filters) {
      if (filter.operator === "eq") {
        builder = builder.where({ [filter.column]: filter.value });
      } else {
        builder = builder.where({
          [filter.column]: {
            [filter.operator]: filter.value,
          },
        });
      }
    }

    return builder
      .orderBy(sortColumn, sortDirection)
      .limit(requestedRowCount + 1)
      .offset(0);
  }, [filters, requestedRowCount, runtime.wasmSchema, sortColumn, sortDirection, tableName]);

  const queryOptions = useMemo(() => {
    return {
      propagation: "full" as const,
      visibility: "hidden_from_live_query_list" as const,
    };
  }, []);

  const rows = useAll<DynamicTableRow>(queryBuilder ?? undefined, queryOptions);
  const resolvedRows = rows ?? EMPTY_ROWS;
  const hasMore = resolvedRows.length > requestedRowCount;
  const visibleRows = hasMore === true ? resolvedRows.slice(0, requestedRowCount) : resolvedRows;

  return {
    columns,
    rows: visibleRows,
    loadedRowCount: visibleRows.length,
    hasMore,
    isFetchingMore: rows === undefined,
    fetchMore: () => {
      if (hasMore === false || rows === undefined) {
        return;
      }

      setRequestedRowCountState((currentState) => ({
        queryKey,
        rowCount: (currentState.queryKey === queryKey ? currentState.rowCount : chunkSize) + chunkSize,
      }));
    },
    resetLoadedRows: () => {
      setRequestedRowCountState({ queryKey, rowCount: chunkSize });
    },
  };
}
