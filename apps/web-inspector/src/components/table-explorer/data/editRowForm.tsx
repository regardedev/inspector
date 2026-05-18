import { useState } from "react";

import type { ColumnDescriptor } from "jazz-tools";

import { Button } from "@regarde/ui/button";
import { EmptyState } from "@regarde/ui/emptyState";
import { cn } from "@regarde/ui/lib/utils";

import { RowEditorFields, useRowEditorFields } from "@/components/table-explorer/data/rowEditorFields";

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
  const rowEditor = useRowEditorFields({
    initialRowValues: rowValues ?? {},
    mode: "edit",
    onSubmit: onSave,
    schemaColumns,
  });

  if (rowValues === null) {
    return <EmptyState title="Select a row" description="Select a row from the data grid to edit it." />;
  }

  return (
    <form className="flex h-full min-h-0 flex-col mt-2 overflow-hidden" onSubmit={rowEditor.submit}>
      <div className="app-scrollbar flex min-h-0 flex-1 flex-col gap-4 px-2 mb-2 overflow-auto">
        <p className="text-sm text-muted-foreground">Id: {targetRowId}</p>

        <RowEditorFields
          errors={rowEditor.errors}
          fieldStates={rowEditor.fieldStates}
          formFields={rowEditor.formFields}
          initialRowValues={rowValues ?? {}}
          mode="edit"
          onFieldNullChange={rowEditor.setFieldNull}
          onFieldTextChange={rowEditor.setFieldText}
          showIdField={false}
        />

        {rowEditor.saveError !== null ? <p className="text-sm text-destructive">{rowEditor.saveError}</p> : null}
      </div>

      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-t border-border bg-background px-3">
        {onDelete !== undefined ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isDeleting === true || rowEditor.isSaving === true}
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
        ) : null}
        <div className={cn("flex items-center gap-2", onDelete === undefined && "ml-auto")}>
          {onCancel !== undefined ? (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={rowEditor.isSaving === true}>
              Cancel
            </Button>
          ) : null}
          <Button type="submit" variant="secondary" size="sm" loading={rowEditor.isSaving === true}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}
