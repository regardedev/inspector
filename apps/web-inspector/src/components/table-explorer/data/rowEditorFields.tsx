import { useMemo, useState } from "react";

import type { ColumnDescriptor } from "jazz-tools";

import { Button } from "@regarde/ui/button";
import { ButtonGroup, ButtonGroupItem } from "@regarde/ui/buttonGroup";
import { Checkbox } from "@regarde/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@regarde/ui/field";
import { Input } from "@regarde/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@regarde/ui/select";
import { Textarea } from "@regarde/ui/textarea";

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

interface RowEditorFieldsResult {
  fields: React.ReactElement;
  isSaving: boolean;
  saveError: string | null;
  submit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

type BooleanFieldValue = "true" | "false" | "null";

interface UseRowEditorFieldsOptions {
  initialRowValues: Record<string, unknown>;
  mode: DetailPaneMode;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  schemaColumns: ColumnDescriptor[];
  showIdField?: boolean;
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
  rowValues: Record<string, unknown>,
  mode: DetailPaneMode,
  schemaColumns: ColumnDescriptor[],
): Record<string, FieldState> {
  return Object.fromEntries(
    schemaColumns.map((column) => [column.name, getInitialFieldState(rowValues[column.name], mode, column)]),
  );
}

function formatColumnTypeLabel(column: ColumnDescriptor): string {
  return column.column_type.type.toLowerCase();
}

function formatColumnNameLabel(columnName: string): string {
  if (columnName.length === 0) {
    return columnName;
  }

  return `${columnName.slice(0, 1).toUpperCase()}${columnName.slice(1)}`;
}

function isStructuredColumn(column: ColumnDescriptor): boolean {
  return column.column_type.type === "Json" || column.column_type.type === "Array" || column.column_type.type === "Row";
}

function isBooleanFieldNull(fieldState: FieldState): BooleanFieldValue {
  if (fieldState.isNull === true) {
    return "null";
  }

  return fieldState.text === "true" ? "true" : "false";
}

export function useRowEditorFields({
  initialRowValues,
  mode,
  onSubmit,
  schemaColumns,
  showIdField = true,
}: UseRowEditorFieldsOptions): RowEditorFieldsResult {
  const { currentBranch, currentConnectionId, currentSchemaHash } = useInspector();
  const [fields, setFields] = useState<Record<string, FieldState>>(() => createInitialFields(initialRowValues, mode, schemaColumns));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const formFields = useMemo(() => buildMutationFields(schemaColumns), [schemaColumns]);

  const setFieldText = (columnName: string, fieldState: FieldState, text: string) => {
    setFields((currentFields) => ({
      ...currentFields,
      [columnName]: { ...fieldState, text },
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [columnName]: "" }));
  };

  const setFieldNull = (columnName: string, fieldState: FieldState, isNull: boolean) => {
    setFields((currentFields) => ({
      ...currentFields,
      [columnName]: { ...fieldState, isNull },
    }));
    setErrors((currentErrors) => ({ ...currentErrors, [columnName]: "" }));
  };

  return {
    fields: (
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto pr-1">
        {showIdField === true ? (
          <Field>
            {(() => {
              const fieldId = `row-editor-id`;

              return (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <FieldLabel htmlFor={fieldId} className="min-w-0">
                        <span>Id</span>
                      </FieldLabel>
                      <span className="text-xs text-muted-foreground">text</span>
                    </div>
                  </div>
                  <FieldContent>
                    <Input id={fieldId} value={mode === "insert" ? "auto-generated" : String(initialRowValues.id ?? "")} readOnly />
                  </FieldContent>
                </>
              );
            })()}
          </Field>
        ) : null}

        {formFields.map(({ column, readOnlyReason }) => {
          const fieldId = `row-editor-${column.name}`;
          const fieldLabelId = `${fieldId}-label`;
          const fieldState = getFieldState(fields, initialRowValues, mode, column);
          const fieldError = errors[column.name];
          const isBooleanColumn = column.column_type.type === "Boolean";
          const isBinaryColumn = column.column_type.type === "Bytea";
          const isStructuredColumnType = isStructuredColumn(column);
          const relationTarget =
            column.references !== undefined && fieldState.isNull === false && fieldState.text.trim().length > 0
              ? fieldState.text.trim()
              : null;

          return (
            <Field key={column.name}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <FieldLabel
                    id={fieldLabelId}
                    htmlFor={isBooleanColumn === true ? undefined : fieldId}
                    className="min-w-0"
                  >
                    <span>{formatColumnNameLabel(column.name)}</span>
                  </FieldLabel>
                  <span className="text-xs text-muted-foreground">{formatColumnTypeLabel(column)}</span>
                </div>
                <div className="flex items-center gap-3">
                  {column.nullable === true && readOnlyReason === null && isBooleanColumn === false ? (
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Checkbox
                        checked={fieldState.isNull}
                        onCheckedChange={(nextChecked) => {
                          setFieldNull(column.name, fieldState, nextChecked === true);
                        }}
                      />
                      <span>NULL</span>
                    </label>
                  ) : null}
                </div>
              </div>
                <FieldContent>
                  {isBooleanColumn === true && readOnlyReason === null ? (
                  <ButtonGroup fullWidth={true} aria-labelledby={fieldLabelId}>
                    <ButtonGroupItem
                      fill={true}
                      selected={isBooleanFieldNull(fieldState) === "true"}
                      onClick={() => {
                        setFields((currentFields) => ({
                          ...currentFields,
                          [column.name]: { text: "true", isNull: false },
                        }));
                        setErrors((currentErrors) => ({ ...currentErrors, [column.name]: "" }));
                      }}
                    >
                      True
                    </ButtonGroupItem>
                    <ButtonGroupItem
                      fill={true}
                      selected={isBooleanFieldNull(fieldState) === "false"}
                      onClick={() => {
                        setFields((currentFields) => ({
                          ...currentFields,
                          [column.name]: { text: "false", isNull: false },
                        }));
                        setErrors((currentErrors) => ({ ...currentErrors, [column.name]: "" }));
                      }}
                    >
                      False
                    </ButtonGroupItem>
                    {column.nullable === true ? (
                      <ButtonGroupItem
                        fill={true}
                        selected={isBooleanFieldNull(fieldState) === "null"}
                        onClick={() => {
                          setFields((currentFields) => ({
                            ...currentFields,
                            [column.name]: { ...fieldState, isNull: true },
                          }));
                          setErrors((currentErrors) => ({ ...currentErrors, [column.name]: "" }));
                        }}
                      >
                        Null
                      </ButtonGroupItem>
                    ) : null}
                  </ButtonGroup>
                ) : column.column_type.type === "Enum" && readOnlyReason === null ? (
                  <Select
                    value={fieldState.text}
                    onValueChange={(nextValue) => {
                      setFieldText(column.name, fieldState, nextValue);
                    }}
                    disabled={fieldState.isNull === true}
                  >
                    <SelectTrigger id={fieldId} className="w-full">
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      {column.column_type.variants.map((variant) => (
                        <SelectItem key={variant} value={variant}>
                          {variant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : isStructuredColumnType === true || isBinaryColumn === true ? (
                  <div className="flex flex-col gap-2">
                    {(isStructuredColumnType === true && readOnlyReason === null) || relationTarget !== null ? (
                      <div className="flex items-center justify-between gap-2">
                        <div />
                        <div className="flex items-center gap-3">
                          {isStructuredColumnType === true && readOnlyReason === null ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                try {
                                  const parsedValue = JSON.parse(fieldState.text) as unknown;
                                  setFieldText(column.name, fieldState, JSON.stringify(parsedValue, null, 2));
                                } catch {
                                  setErrors((currentErrors) => ({
                                    ...currentErrors,
                                    [column.name]: `${formatColumnTypeLabel(column)} value is invalid JSON.`,
                                  }));
                                }
                              }}
                            >
                              Format
                            </Button>
                          ) : null}
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
                      </div>
                    ) : null}
                    <Textarea
                      id={fieldId}
                      className="min-h-28 font-mono"
                      value={fieldState.text}
                      readOnly={readOnlyReason !== null || isBinaryColumn === true}
                      disabled={fieldState.isNull === true}
                      onChange={(event) => {
                        const nextValue = event.currentTarget.value;
                        setFieldText(column.name, fieldState, nextValue);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {relationTarget !== null &&
                    column.references !== undefined &&
                    currentConnectionId !== null &&
                    currentBranch !== null &&
                    currentSchemaHash !== null ? (
                      <div className="flex justify-end">
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
                      </div>
                    ) : null}
                    <Input
                      id={fieldId}
                      value={fieldState.text}
                      readOnly={readOnlyReason !== null}
                      disabled={fieldState.isNull === true}
                      onChange={(event) => {
                        const nextValue = event.currentTarget.value;
                        setFieldText(column.name, fieldState, nextValue);
                      }}
                    />
                  </div>
                )}
              </FieldContent>

              {getFieldReadOnlyReason(column) === "binary" ? (
                <FieldDescription>Read-only: binary field</FieldDescription>
              ) : null}
              <FieldError>{fieldError !== undefined && fieldError.length > 0 ? fieldError : null}</FieldError>
            </Field>
          );
        })}
      </div>
    ),
    isSaving,
    saveError,
    submit: async (event) => {
      event.preventDefault();
      const nextErrors: Record<string, string> = {};
      const updates: Record<string, unknown> = {};

      for (const field of formFields) {
        if (field.readOnlyReason !== null) {
          continue;
        }

        const fieldState = getFieldState(fields, initialRowValues, mode, field.column);
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
        await onSubmit(updates);
      } catch (nextError) {
        setSaveError(nextError instanceof Error ? nextError.message : String(nextError));
      } finally {
        setIsSaving(false);
      }
    },
  };
}
