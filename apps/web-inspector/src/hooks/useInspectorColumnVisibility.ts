import { useEffect, useMemo, useState } from "react";

import type { TableColumnVisibilityState } from "@/types/tableExplorer";

interface UseInspectorColumnVisibilityOptions {
  columnIds: string[];
  tableKey: string;
}

interface UseInspectorColumnVisibilityResult {
  columnVisibility: TableColumnVisibilityState;
  setColumnVisibility: (next: TableColumnVisibilityState) => void;
}

function createDefaultColumnVisibility(columnIds: string[]): TableColumnVisibilityState {
  return Object.fromEntries(columnIds.map((columnId) => [columnId, true]));
}

function areColumnVisibilityStatesEqual(
  left: TableColumnVisibilityState,
  right: TableColumnVisibilityState,
  columnIds: string[],
): boolean {
  return columnIds.every((columnId) => left[columnId] === right[columnId]);
}

export function useInspectorColumnVisibility({
  columnIds,
  tableKey,
}: UseInspectorColumnVisibilityOptions): UseInspectorColumnVisibilityResult {
  const storageKey = useMemo(() => `inspector:column-visibility:${tableKey}`, [tableKey]);
  const columnIdsKey = useMemo(() => columnIds.join("|"), [columnIds]);
  const defaultColumnVisibility = useMemo(() => createDefaultColumnVisibility(columnIds), [columnIds]);
  const [columnVisibility, setColumnVisibilityState] = useState<TableColumnVisibilityState>(defaultColumnVisibility);

  useEffect(() => {
    const applyNextColumnVisibility = (nextColumnVisibility: TableColumnVisibilityState) => {
      setColumnVisibilityState((currentColumnVisibility) => {
        if (areColumnVisibilityStatesEqual(currentColumnVisibility, nextColumnVisibility, columnIds) === true) {
          return currentColumnVisibility;
        }

        return nextColumnVisibility;
      });
    };

    const storedValue = window.localStorage.getItem(storageKey);
    if (storedValue === null) {
      applyNextColumnVisibility(defaultColumnVisibility);
      return;
    }

    try {
      const parsedValue = JSON.parse(storedValue) as TableColumnVisibilityState;
      const nextColumnVisibility: TableColumnVisibilityState = { ...defaultColumnVisibility };

      for (const columnId of columnIds) {
        if (parsedValue[columnId] === false) {
          nextColumnVisibility[columnId] = false;
        }
      }

      applyNextColumnVisibility(nextColumnVisibility);
    } catch {
      applyNextColumnVisibility(defaultColumnVisibility);
    }
  }, [columnIds, columnIdsKey, defaultColumnVisibility, storageKey]);

  const setColumnVisibility = (next: TableColumnVisibilityState) => {
    const nextValue: TableColumnVisibilityState = { ...defaultColumnVisibility, ...next };
    setColumnVisibilityState((currentColumnVisibility) => {
      if (areColumnVisibilityStatesEqual(currentColumnVisibility, nextValue, columnIds) === true) {
        return currentColumnVisibility;
      }

      return nextValue;
    });
    window.localStorage.setItem(storageKey, JSON.stringify(nextValue));
  };

  return {
    columnVisibility,
    setColumnVisibility,
  };
}
