import { useEffect, useMemo, useState } from "react";

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
  const [selectedRowIds, setSelectedRowIds] = useState<TableRowId[]>([]);

  useEffect(() => {
    setSelectedRowIds((currentSelectedRowIds) => {
      const nextSelectedRowIds = currentSelectedRowIds.filter((rowId) => validRowIds.includes(rowId));
      const hasChanged = nextSelectedRowIds.length !== currentSelectedRowIds.length;
      return hasChanged === true ? nextSelectedRowIds : currentSelectedRowIds;
    });
  }, [validRowIds]);

  const activeRowId = useMemo<TableRowId | null>(() => {
    return selectedRowIds[0] ?? null;
  }, [selectedRowIds]);

  return {
    activeRowId,
    selectedRowIds,
    selectedRowCount: selectedRowIds.length,
    clearSelection: () => {
      setSelectedRowIds([]);
    },
    setSelectedRowIds,
    toggleAllRows: (rowIds, checked) => {
      if (checked === true) {
        setSelectedRowIds(rowIds);
        return;
      }

      setSelectedRowIds([]);
    },
    toggleRow: (rowId, checked) => {
      setSelectedRowIds((currentSelectedRowIds) => {
        const hasRowId = currentSelectedRowIds.includes(rowId);
        if (checked === true && hasRowId === false) {
          return [...currentSelectedRowIds, rowId];
        }
        if (checked === false && hasRowId === true) {
          return currentSelectedRowIds.filter((currentRowId) => currentRowId !== rowId);
        }
        return currentSelectedRowIds;
      });
    },
  };
}
