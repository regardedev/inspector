// TODO: standardize this `ColumnDescriptor`
import type { ColumnDescriptor } from "jazz-tools";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

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
  rowValues: Record<string, unknown> | null;
  schemaColumns: ColumnDescriptor[];
  tableName: string;
}

export function RowEditorSidePanel({
  activeRowIndex,
  children,
  editedRowIds,
  mode,
  onNavigateNext,
  onNavigatePrevious,
}: RowEditorSidePanelProps): React.ReactElement {
  const hasMultipleRows = editedRowIds.length > 1;
  const title = mode === "insert" ? "Insert row" : editedRowIds.length > 1 ? "Edit rows" : "Edit row";

  return (
    <DetailPane
      title={
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{title}</p>
          {hasMultipleRows === true ? (
            <div className="ml-auto flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
              <span>{activeRowIndex + 1} / {editedRowIds.length}</span>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={activeRowIndex === 0}
                  onClick={onNavigatePrevious}
                  aria-label="Previous selected row"
                >
                  <ArrowUpIcon className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={activeRowIndex >= editedRowIds.length - 1}
                  onClick={onNavigateNext}
                  aria-label="Next selected row"
                >
                  <ArrowDownIcon className="size-3.5" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      }
    >
      {children}
    </DetailPane>
  );
}
