import { useEffect, useMemo, useState } from "react";

import type { DetailPaneMode, InspectorRowEditorMode, TableRowId } from "@/types/tableExplorer";

interface UseInspectorRowEditorOptions {
  forcedMode?: DetailPaneMode | null;
  selectedRowIds: TableRowId[];
}

interface UseInspectorRowEditorResult {
  activeRowId: TableRowId | null;
  activeRowIndex: number;
  close: () => void;
  editedRowIds: TableRowId[];
  goToNextRow: () => void;
  goToPreviousRow: () => void;
  isOpen: boolean;
  mode: InspectorRowEditorMode;
  openEditSelection: (rowIds?: TableRowId[]) => void;
  openInsert: () => void;
  setActiveRowIndex: (index: number) => void;
}

export function useInspectorRowEditor({
  forcedMode = null,
  selectedRowIds,
}: UseInspectorRowEditorOptions): UseInspectorRowEditorResult {
  const [mode, setMode] = useState<InspectorRowEditorMode>(forcedMode ?? "closed");
  const [editedRowIds, setEditedRowIds] = useState<TableRowId[]>([]);
  const [activeRowIndex, setActiveRowIndex] = useState(0);

  useEffect(() => {
    if (forcedMode === null) {
      return;
    }

    setMode(forcedMode);
  }, [forcedMode]);

  useEffect(() => {
    if (mode === "insert") {
      return;
    }

    const hasSameEditedRowIds =
      editedRowIds.length === selectedRowIds.length &&
      editedRowIds.every((rowId, index) => rowId === selectedRowIds[index]);

    if (selectedRowIds.length === 0) {
      if (forcedMode === "edit") {
        if (mode !== "edit") {
          setMode("edit");
        }
        if (editedRowIds.length > 0) {
          setEditedRowIds([]);
        }
        if (activeRowIndex !== 0) {
          setActiveRowIndex(0);
        }
        return;
      }

      if (mode !== "closed") {
        setMode("closed");
      }
      if (editedRowIds.length > 0) {
        setEditedRowIds([]);
      }
      if (activeRowIndex !== 0) {
        setActiveRowIndex(0);
      }
      return;
    }

    if (mode !== "edit") {
      setMode("edit");
    }
    if (hasSameEditedRowIds === false) {
      setEditedRowIds(selectedRowIds);
    }

    const nextActiveRowIndex = Math.min(activeRowIndex, selectedRowIds.length - 1);
    if (nextActiveRowIndex !== activeRowIndex) {
      setActiveRowIndex(nextActiveRowIndex);
    }
  }, [activeRowIndex, editedRowIds, forcedMode, mode, selectedRowIds]);

  const activeRowId = useMemo(() => {
    if (mode !== "edit") {
      return null;
    }

    return editedRowIds[activeRowIndex] ?? null;
  }, [activeRowIndex, editedRowIds, mode]);

  return {
    activeRowId,
    activeRowIndex,
    editedRowIds,
    mode,
    isOpen: mode !== "closed",
    openInsert: () => {
      setMode("insert");
      setEditedRowIds([]);
      setActiveRowIndex(0);
    },
    openEditSelection: (rowIds) => {
      const nextEditedRowIds = rowIds ?? selectedRowIds;
      if (nextEditedRowIds.length === 0) {
        return;
      }

      setMode("edit");
      setEditedRowIds(nextEditedRowIds);
      setActiveRowIndex(0);
    },
    close: () => {
      if (forcedMode !== null) {
        setMode(forcedMode);
        if (forcedMode === "edit") {
          setEditedRowIds(selectedRowIds);
          setActiveRowIndex(0);
          return;
        }
      }

      setMode("closed");
      setEditedRowIds([]);
      setActiveRowIndex(0);
    },
    goToNextRow: () => {
      setActiveRowIndex((currentActiveRowIndex) => {
        if (editedRowIds.length === 0) {
          return 0;
        }

        return Math.min(currentActiveRowIndex + 1, editedRowIds.length - 1);
      });
    },
    goToPreviousRow: () => {
      setActiveRowIndex((currentActiveRowIndex) => Math.max(currentActiveRowIndex - 1, 0));
    },
    setActiveRowIndex: (index) => {
      setActiveRowIndex(index);
    },
  };
}
