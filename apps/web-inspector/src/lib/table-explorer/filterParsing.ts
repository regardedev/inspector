import type { ColumnDescriptor, ColumnType } from "jazz-tools";

import { getSupportedWhereOperatorsForColumn } from "@/lib/table-explorer/whereOperators";
import { parseBooleanValue } from "@/lib/table-explorer/valueParsing";
import type { TableFilterClause, TableFilterOperator } from "@/types/tableFilters";

function parseBytea(value: string): Uint8Array {
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  const bytes = parts.map((part) => {
    const parsedNumber = Number(part);
    if (Number.isInteger(parsedNumber) === false || parsedNumber < 0 || parsedNumber > 255) {
      throw new Error("Bytea bytes must be integers in range 0..255.");
    }
    return parsedNumber;
  });

  return new Uint8Array(bytes);
}

function parseJsonValue(value: string): unknown {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    return "";
  }

  try {
    return JSON.parse(trimmedValue) as unknown;
  } catch {
    return trimmedValue;
  }
}

function parseScalarValue(columnType: ColumnType, value: string): unknown {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) {
    throw new Error("Value is required.");
  }

  switch (columnType.type) {
    case "Boolean": {
      const parsedValue = parseBooleanValue(trimmedValue);
      if (parsedValue === null) {
        throw new Error('Boolean values must be "true" or "false".');
      }

      return parsedValue;
    }
    case "Integer":
    case "Double": {
      const parsedValue = Number(trimmedValue);
      if (Number.isFinite(parsedValue) === false) {
        throw new Error("Numeric values must be finite numbers.");
      }

      return parsedValue;
    }
    case "BigInt": {
      try {
        BigInt(trimmedValue);
        return trimmedValue;
      } catch {
        throw new Error("Value must be an integer.");
      }
    }
    case "Bytea":
      return parseBytea(trimmedValue);
    case "Json":
      return parseJsonValue(trimmedValue);
    case "Array":
      return JSON.parse(trimmedValue) as unknown;
    case "Enum":
      if (columnType.variants.includes(trimmedValue) === false) {
        throw new Error(`Expected one of: ${columnType.variants.join(", ")}`);
      }
      return trimmedValue;
    default:
      return trimmedValue;
  }
}

export function createFilterClauseId(): string {
  return `filter-${Math.random().toString(16).slice(2, 10)}`;
}

export function parseFilterValue(
  column: Pick<ColumnDescriptor, "column_type" | "nullable">,
  operator: TableFilterOperator,
  value: string,
): unknown {
  if (operator === "isNull") {
    const parsedValue = parseBooleanValue(value);
    if (parsedValue === null) {
      throw new Error('isNull value must be "true" or "false".');
    }

    return parsedValue;
  }

  if (operator === "in") {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
    if (items.length === 0) {
      throw new Error('The "in" operator requires at least one value.');
    }

    return items.map((item) => parseScalarValue(column.column_type, item));
  }

  if (operator === "contains" && column.column_type.type === "Array") {
    return parseScalarValue(column.column_type.element, value);
  }

  return parseScalarValue(column.column_type, value);
}

export function parseFiltersFromSearchParam(value: string | null): TableFilterClause[] {
  if (value === null) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value) as unknown;
    if (Array.isArray(parsedValue) === false) {
      return [];
    }

    return parsedValue.filter((item): item is TableFilterClause => {
      if (typeof item !== "object" || item === null) {
        return false;
      }

      const candidate = item as TableFilterClause;
      return (
        typeof candidate.id === "string" &&
        typeof candidate.column === "string" &&
        typeof candidate.operator === "string"
      );
    });
  } catch {
    return [];
  }
}

export function serializeFiltersToSearchParam(filters: TableFilterClause[]): string | null {
  if (filters.length === 0) {
    return null;
  }

  return JSON.stringify(filters);
}

export function getFilterOperatorsForColumn(column: ColumnDescriptor): TableFilterOperator[] {
  return getSupportedWhereOperatorsForColumn({
    name: column.name,
    columnType: column.column_type,
    nullable: column.nullable,
    references: column.references,
  });
}
