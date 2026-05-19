import type { ColumnDescriptor, WasmSchema } from "jazz-tools";

const RELATION_LABEL_COLUMN_PRIORITY = [
  "name",
  "title",
  "label",
  "displayName",
  "display_name",
  "username",
  "handle",
  "slug",
  "email",
] as const;

function isDisplayFriendlyColumn(column: ColumnDescriptor): boolean {
  if (column.name === "id" || column.references !== undefined) {
    return false;
  }

  switch (column.column_type.type) {
    case "Text":
    case "Enum":
    case "Timestamp":
    case "Integer":
    case "BigInt":
    case "Double":
    case "Boolean":
      return true;
    default:
      return false;
  }
}

export function getTableNames(schema: WasmSchema | null): string[] {
  if (schema === null) {
    return [];
  }

  return Object.keys(schema).sort((left, right) => left.localeCompare(right));
}

export function getTableColumns(schema: WasmSchema | null, tableName: string | null): ColumnDescriptor[] {
  if (schema === null || tableName === null) {
    return [];
  }

  return schema[tableName]?.columns ?? [];
}

export function getRelationDisplayColumn(
  schema: WasmSchema | null,
  tableName: string | null,
): ColumnDescriptor | null {
  const columns = getTableColumns(schema, tableName);

  for (const columnName of RELATION_LABEL_COLUMN_PRIORITY) {
    const match = columns.find(
      (column) => column.name === columnName && isDisplayFriendlyColumn(column) === true,
    );
    if (match !== undefined) {
      return match;
    }
  }

  const firstTextColumn = columns.find(
    (column) => column.column_type.type === "Text" && isDisplayFriendlyColumn(column) === true,
  );
  if (firstTextColumn !== undefined) {
    return firstTextColumn;
  }

  return columns.find((column) => isDisplayFriendlyColumn(column) === true) ?? null;
}
