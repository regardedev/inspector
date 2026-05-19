import type { ColumnDescriptor, ColumnType } from "jazz-tools";

import { parseBooleanValue } from "@/lib/table-explorer/valueParsing";

export type MutationFieldReadOnlyReason = "binary" | null;

export interface MutationFormField {
  column: ColumnDescriptor;
  readOnlyReason: MutationFieldReadOnlyReason;
}

function isBinaryColumnType(columnType: ColumnType): boolean {
  if (columnType.type === "Bytea") {
    return true;
  }
  if (columnType.type === "Array") {
    return isBinaryColumnType(columnType.element);
  }
  return false;
}

export function getFieldReadOnlyReason(column: ColumnDescriptor): MutationFieldReadOnlyReason {
  if (isBinaryColumnType(column.column_type) === true) {
    return "binary";
  }

  return null;
}

export function buildMutationFields(columns: ColumnDescriptor[]): MutationFormField[] {
  return columns.map((column) => ({
    column,
    readOnlyReason: getFieldReadOnlyReason(column),
  }));
}

export function parseMutationFieldValue(columnType: ColumnType, valueText: string): unknown {
  const trimmedValue = valueText.trim();

  switch (columnType.type) {
    case "Boolean": {
      const parsedValue = parseBooleanValue(trimmedValue);
      if (parsedValue === null) {
        throw new Error('Boolean values must be "true" or "false".');
      }
      return parsedValue;
    }
    case "Integer": {
      if (trimmedValue.length === 0) {
        throw new Error("Value is required.");
      }
      const parsedValue = Number(trimmedValue);
      if (Number.isInteger(parsedValue) === false) {
        throw new Error("Value must be an integer.");
      }
      return parsedValue;
    }
    case "BigInt": {
      if (trimmedValue.length === 0) {
        throw new Error("Value is required.");
      }
      try {
        BigInt(trimmedValue);
        return trimmedValue;
      } catch {
        throw new Error("Value must be an integer.");
      }
    }
    case "Double": {
      if (trimmedValue.length === 0) {
        throw new Error("Value is required.");
      }
      const parsedValue = Number(trimmedValue);
      if (Number.isFinite(parsedValue) === false) {
        throw new Error("Value must be a finite number.");
      }
      return parsedValue;
    }
    case "Timestamp": {
      if (trimmedValue.length === 0) {
        throw new Error("Timestamp is required.");
      }
      const parsedAsNumber = Number(trimmedValue);
      if (Number.isFinite(parsedAsNumber) === true) {
        return parsedAsNumber;
      }
      const parsedAsDate = Date.parse(trimmedValue);
      if (Number.isFinite(parsedAsDate) === true) {
        return parsedAsDate;
      }
      throw new Error("Timestamp must be milliseconds or an ISO date string.");
    }
    case "Json": {
      if (trimmedValue.length === 0) {
        throw new Error("JSON value is required.");
      }
      try {
        return JSON.parse(trimmedValue) as unknown;
      } catch {
        throw new Error("JSON value is invalid.");
      }
    }
    case "Bytea":
      throw new Error("Binary fields are read-only in the inspector.");
    case "Array": {
      try {
        const parsedValue = JSON.parse(trimmedValue) as unknown;
        if (Array.isArray(parsedValue) === false) {
          throw new Error("Array must be valid JSON array.");
        }
        return parsedValue;
      } catch {
        throw new Error("Array must be valid JSON array.");
      }
    }
    case "Row": {
      try {
        const parsedValue = JSON.parse(trimmedValue) as unknown;
        const isValidObject =
          typeof parsedValue === "object" && parsedValue !== null && Array.isArray(parsedValue) === false;
        if (isValidObject === false) {
          throw new Error("Row value must be valid JSON object.");
        }
        return parsedValue;
      } catch {
        throw new Error("Row value must be valid JSON object.");
      }
    }
    case "Enum":
      if (columnType.variants.includes(valueText) === false) {
        throw new Error(`Expected one of: ${columnType.variants.join(", ")}`);
      }
      return valueText;
    case "Text":
    case "Uuid":
    default:
      return valueText;
  }
}

export function formatMutationFieldValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value instanceof Uint8Array) {
    return `(${value.length} bytes)`;
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}
