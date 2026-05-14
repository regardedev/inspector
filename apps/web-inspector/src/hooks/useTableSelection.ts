import { useMemo, useState } from "react";

import type { TableRowId } from "@/types/tableExplorer";

export interface UseTableSelectionOptions {
  validRowIds: TableRowId[];
}

export interface UseTableSelectionResult {
  activeRowId: TableRowId | null;
  selectedRowIds: TableRowId[];
  selectedRowCount: number;
  clearSelection: () => void;
  setSelectedRowIds: (rowIds: TableRowId[]) => void;
  toggleAllRows: (rowIds: TableRowId[], checked: boolean) => void;
  toggleRow: (rowId: TableRowId, checked: boolean) => void;
}

export function useTableSelection({
  validRowIds,
}: UseTableSelectionOptions): UseTableSelectionResult {
  const [storedSelectedRowIds, setStoredSelectedRowIds] = useState<TableRowId[]>([]);
  const validRowIdsSet = useMemo(() => new Set(validRowIds), [validRowIds]);

  const selectedRowIds = useMemo(() => {
    return storedSelectedRowIds.filter((rowId) => validRowIdsSet.has(rowId) === true);
  }, [storedSelectedRowIds, validRowIdsSet]);

  const activeRowId = useMemo<TableRowId | null>(() => {
    return selectedRowIds[0] ?? null;
  }, [selectedRowIds]);

  return {
    activeRowId,
    selectedRowIds,
    selectedRowCount: selectedRowIds.length,
    clearSelection: () => {
      setStoredSelectedRowIds([]);
    },
    setSelectedRowIds: (rowIds) => {
      setStoredSelectedRowIds(rowIds.filter((rowId) => validRowIdsSet.has(rowId) === true));
    },
    toggleAllRows: (rowIds, checked) => {
      if (checked === true) {
        setStoredSelectedRowIds(rowIds.filter((rowId) => validRowIdsSet.has(rowId) === true));
        return;
      }

      setStoredSelectedRowIds([]);
    },
    toggleRow: (rowId, checked) => {
      setStoredSelectedRowIds((currentSelectedRowIds) => {
        const nextSelectedRowIds = currentSelectedRowIds.filter((currentRowId) => validRowIdsSet.has(currentRowId) === true);
        const hasRowId = nextSelectedRowIds.includes(rowId);
        if (checked === true && hasRowId === false) {
          if (validRowIdsSet.has(rowId) === false) {
            return nextSelectedRowIds;
          }

          return [...nextSelectedRowIds, rowId];
        }
        if (checked === false && hasRowId === true) {
          return nextSelectedRowIds.filter((currentRowId) => currentRowId !== rowId);
        }

        return nextSelectedRowIds;
      });
    },
  };
}
