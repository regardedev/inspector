import { useMemo, useState } from "react";

import type { ColumnDescriptor } from "jazz-tools";

import { Button } from "@regarde/ui/button";
import { Input } from "@regarde/ui/input";

import { useInspector } from "@/components/providers/inspectorProvider";
import {
  buildMutationFields,
  formatMutationFieldValue,
  getFieldReadOnlyReason,
  parseMutationFieldValue,
} from "@/lib/table-explorer/mutationParsing";
import { buildRelationTableHref } from "@/lib/table-explorer/relationNavigation";
import type { DetailPaneMode } from "@/types/tableExplorer";

interface FieldState {
  isNull: boolean;
  text: string;
}

interface RowEditorFormProps {
  mode: DetailPaneMode;
  rowValues: Record<string, unknown> | null;
  schemaColumns: ColumnDescriptor[];
  tableName: string;
  targetRowId: string | null;
  onCancel?: () => void;
  onDelete?: () => Promise<void> | void;
  onSave: (values: Record<string, unknown>) => Promise<void> | void;
}

function modeLabel(mode: DetailPaneMode): string {
  return mode === "edit" ? "Edit row" : "Insert row";
}

function submitLabel(mode: DetailPaneMode): string {
  return mode === "edit" ? "Save" : "Insert";
}

function getInitialFieldState(value: unknown, mode: DetailPaneMode, column: ColumnDescriptor): FieldState {
  if (mode === "insert") {
    return {
      text: formatMutationFieldValue(value),
      isNull: column.nullable,
    };
  }

  return {
    text: formatMutationFieldValue(value),
    isNull: value === null || value === undefined,
  };
}

function getFieldState(
  fields: Record<string, FieldState>,
  rowValues: Record<string, unknown>,
  mode: DetailPaneMode,
  column: ColumnDescriptor,
): FieldState {
  return fields[column.name] ?? getInitialFieldState(rowValues[column.name], mode, column);
}

function createInitialFields(
  rowValues: Record<string, unknown> | null,
  mode: DetailPaneMode,
  schemaColumns: ColumnDescriptor[],
): Record<string, FieldState> {
  if (rowValues === null) {
    return {};
  }

  return Object.fromEntries(
    schemaColumns.map((column) => [column.name, getInitialFieldState(rowValues[column.name], mode, column)]),
  );
}

export function RowEditorForm({
  mode,
  rowValues,
  schemaColumns,
  tableName,
  targetRowId,
  onCancel,
  onDelete,
  onSave,
}: RowEditorFormProps): React.ReactElement {
  const { currentBranch, currentConnectionId, currentSchemaHash } = useInspector();
  const [fields, setFields] = useState<Record<string, FieldState>>(() => createInitialFields(rowValues, mode, schemaColumns));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const formFields = useMemo(() => buildMutationFields(schemaColumns), [schemaColumns]);

  if (rowValues === null) {
    return (
      <div className="flex h-full flex-col gap-2">
        <p className="text-sm font-medium text-foreground">{modeLabel(mode)}</p>
        <p className="text-sm text-muted-foreground">Select a row to edit it.</p>
      </div>
    );
  }

  return (
    <form
      className="flex h-full flex-col gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};
        const updates: Record<string, unknown> = {};

        for (const field of formFields) {
          if (field.readOnlyReason !== null) {
            continue;
          }

          const fieldState = getFieldState(fields, rowValues, mode, field.column);
          if (fieldState.isNull === true) {
            if (field.column.nullable === false) {
              nextErrors[field.column.name] = "This column is not nullable.";
            } else {
              updates[field.column.name] = null;
            }
            continue;
          }

          try {
            updates[field.column.name] = parseMutationFieldValue(field.column.column_type, fieldState.text);
          } catch (nextError) {
            nextErrors[field.column.name] = nextError instanceof Error ? nextError.message : String(nextError);
          }
        }

        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) {
          return;
        }

        try {
          setIsSaving(true);
          setSaveError(null);
          await onSave(updates);
        } catch (nextError) {
          setSaveError(nextError instanceof Error ? nextError.message : String(nextError));
        } finally {
          setIsSaving(false);
        }
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{modeLabel(mode)}</p>
        <p className="text-sm text-muted-foreground">
          {tableName} · {mode === "insert" ? "new row" : targetRowId}
        </p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto pr-1">
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">id</span>
          <Input value={mode === "insert" ? "auto-generated" : (targetRowId ?? "")} readOnly />
        </label>

        {formFields.map(({ column, readOnlyReason }) => {
          const fieldState = getFieldState(fields, rowValues, mode, column);
          const fieldError = errors[column.name];
          const relationTarget =
            column.references !== undefined && fieldState.isNull === false && fieldState.text.trim().length > 0
              ? fieldState.text.trim()
              : null;

          return (
            <div key={column.name} className="flex flex-col gap-2">
              <label className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{column.name}</span>
                  {relationTarget !== null &&
                  column.references !== undefined &&
                  currentConnectionId !== null &&
                  currentBranch !== null &&
                  currentSchemaHash !== null ? (
                    <a
                      href={buildRelationTableHref({
                        connectionId: currentConnectionId,
                        branch: currentBranch,
                        schemaHash: currentSchemaHash,
                        tableName: column.references,
                        relationId: relationTarget,
                      })}
                      className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Show
                    </a>
                  ) : null}
                </div>
                {column.column_type.type === "Enum" && readOnlyReason === null ? (
                  <select
                    value={fieldState.text}
                    className="h-8 rounded-sm border border-border bg-background px-2 text-sm"
                    disabled={fieldState.isNull === true}
                    onChange={(event) => {
                      setFields((currentFields) => ({
                        ...currentFields,
                        [column.name]: { ...fieldState, text: event.currentTarget.value },
                      }));
                      setErrors((currentErrors) => ({ ...currentErrors, [column.name]: "" }));
                    }}
                  >
                    {column.column_type.variants.map((variant) => (
                      <option key={variant} value={variant}>
                        {variant}
                      </option>
                    ))}
                  </select>
                ) : column.column_type.type === "Json" ||
                  column.column_type.type === "Array" ||
                  column.column_type.type === "Row" ? (
                  <textarea
                    className="min-h-24 rounded-sm border border-border bg-background px-3 py-2 text-sm"
                    value={fieldState.text}
                    readOnly={readOnlyReason !== null}
                    disabled={fieldState.isNull === true}
                    onChange={(event) => {
                      setFields((currentFields) => ({
                        ...currentFields,
                        [column.name]: { ...fieldState, text: event.currentTarget.value },
                      }));
                      setErrors((currentErrors) => ({ ...currentErrors, [column.name]: "" }));
                    }}
                  />
                ) : (
                  <Input
                    value={fieldState.text}
                    readOnly={readOnlyReason !== null}
                    disabled={fieldState.isNull === true}
                    onChange={(event) => {
                      setFields((currentFields) => ({
                        ...currentFields,
                        [column.name]: { ...fieldState, text: event.currentTarget.value },
                      }));
                      setErrors((currentErrors) => ({ ...currentErrors, [column.name]: "" }));
                    }}
                  />
                )}
              </label>

              {column.nullable === true && readOnlyReason === null ? (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={fieldState.isNull}
                    onChange={(event) => {
                      setFields((currentFields) => ({
                        ...currentFields,
                        [column.name]: { ...fieldState, isNull: event.currentTarget.checked },
                      }));
                    }}
                  />
                  Set NULL
                </label>
              ) : null}

              {getFieldReadOnlyReason(column) === "binary" ? (
                <p className="text-xs text-muted-foreground">Read-only: binary field</p>
              ) : null}
              {fieldError !== undefined && fieldError.length > 0 ? (
                <p className="text-xs text-destructive">{fieldError}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {saveError !== null ? <p className="text-sm text-destructive">{saveError}</p> : null}

      <div className="flex items-center justify-between gap-2">
        {mode === "edit" && onDelete !== undefined ? (
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
            {submitLabel(mode)}
          </Button>
        </div>
      </div>
    </form>
  );
}
