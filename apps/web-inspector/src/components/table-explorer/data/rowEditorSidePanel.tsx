import type { ColumnDescriptor } from "jazz-tools";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@regarde/ui/button";

import { DetailPane } from "@/components/table-explorer/detailPane";
import type { TableRowId } from "@/types/tableExplorer";

interface RowEditorSidePanelProps {
  activeRowId: TableRowId | null;
  activeRowIndex: number;
  children: React.ReactNode;
  editedRowIds: TableRowId[];
  mode: "insert" | "edit";
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  rowValues: Record<string, unknown> | null;
  schemaColumns: ColumnDescriptor[];
  tableName: string;
}

export function RowEditorSidePanel({
  activeRowId,
  activeRowIndex,
  children,
  editedRowIds,
  mode,
  onNavigateNext,
  onNavigatePrevious,
  onOpenChange,
  open,
}: RowEditorSidePanelProps): React.ReactElement {
  const hasMultipleRows = editedRowIds.length > 1;
  const title = mode === "insert" ? "Insert row" : editedRowIds.length > 1 ? "Edit rows" : "Edit row";

  return (
    <DetailPane
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{title}</p>
            {mode === "edit" ? (
              <p className="truncate text-xs text-muted-foreground">
                {hasMultipleRows === true ? `${editedRowIds.length} selected` : activeRowId}
              </p>
            ) : null}
          </div>
          {hasMultipleRows === true ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{activeRowIndex + 1} / {editedRowIds.length}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={activeRowIndex === 0}
                onClick={onNavigatePrevious}
                aria-label="Previous selected row"
              >
                <ChevronLeftIcon className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={activeRowIndex >= editedRowIds.length - 1}
                onClick={onNavigateNext}
                aria-label="Next selected row"
              >
                <ChevronRightIcon className="size-3.5" />
              </Button>
            </div>
          ) : null}
        </div>
      }
    >
      {children}
    </DetailPane>
  );
}
