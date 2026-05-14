import { useState } from "react";

import type { ColumnDescriptor } from "jazz-tools";

import { Button } from "@regarde/ui/button";

import { useRowEditorFields } from "@/components/table-explorer/data/rowEditorFields";

interface EditRowFormProps {
  onCancel?: () => void;
  onDelete?: () => Promise<void> | void;
  onSave: (values: Record<string, unknown>) => Promise<void> | void;
  rowValues: Record<string, unknown> | null;
  schemaColumns: ColumnDescriptor[];
  targetRowId: string | null;
}

export function EditRowForm({
  onCancel,
  onDelete,
  onSave,
  rowValues,
  schemaColumns,
  targetRowId,
}: EditRowFormProps): React.ReactElement {
  const [isDeleting, setIsDeleting] = useState(false);
  const { fields, isSaving, saveError, submit } = useRowEditorFields({
    initialRowValues: rowValues ?? {},
    mode: "edit",
    onSubmit: onSave,
    schemaColumns,
    showIdField: false,
  });

  if (rowValues === null) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-2">
        <p className="text-sm text-muted-foreground">Select a row to edit it.</p>
      </div>
    );
  }

  return (
    <form className="flex h-full min-h-0 flex-col overflow-hidden" onSubmit={submit}>
      <div className="app-scrollbar flex min-h-0 flex-1 flex-col gap-4 px-2 overflow-auto">
        <p className="text-sm text-muted-foreground">{targetRowId}</p>

        {fields}

        {saveError !== null ? <p className="text-sm text-destructive">{saveError}</p> : null}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 px-2 border-t border-border bg-background py-3">
        {onDelete !== undefined ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isDeleting === true || isSaving === true}
            onClick={async () => {
              try {
                setIsDeleting(true);
                await onDelete();
              } finally {
                setIsDeleting(false);
              }
            }}
          >
            {isDeleting === true ? "Deleting..." : "Delete"}
          </Button>
        ) : <div />}
        <div className="flex items-center gap-2">
          {onCancel !== undefined ? (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isSaving === true}>
              Cancel
            </Button>
          ) : null}
          <Button type="submit" variant="secondary" size="sm" loading={isSaving === true}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
