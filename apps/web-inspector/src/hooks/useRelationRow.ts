import { useMemo } from "react";

import type { DynamicTableRow } from "jazz-tools";
import { useAll } from "jazz-tools/react";

import { useInspector } from "@/components/providers/inspectorProvider";
import { GenericQueryBuilder } from "@/lib/table-explorer/genericQueryBuilder";
import { getRelationDisplayColumn } from "@/lib/table-explorer/tableSchema";

const EMPTY_ROWS: DynamicTableRow[] = [];

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

export interface UseRelationRowResult {
  displayValue: string;
  row: DynamicTableRow | null;
}

export function useRelationRow(relationTable: string, relationId: string): UseRelationRowResult {
  const { runtime } = useInspector();

  const queryBuilder = useMemo(() => {
    if (runtime.wasmSchema === null) {
      return null;
    }

    return new GenericQueryBuilder(relationTable, runtime.wasmSchema).where({ id: relationId }).limit(1);
  }, [relationId, relationTable, runtime.wasmSchema]);

  const relationRows = useAll<DynamicTableRow>(
    queryBuilder ?? undefined,
    { propagation: "full", visibility: "hidden_from_live_query_list" },
  ) ?? EMPTY_ROWS;
  const row = relationRows[0] ?? null;
  const displayColumn = useMemo(() => {
    return getRelationDisplayColumn(runtime.wasmSchema, relationTable);
  }, [relationTable, runtime.wasmSchema]);

  return {
    row,
    displayValue:
      row !== null && displayColumn !== null
        ? formatCellValue(row[displayColumn.name])
        : formatCellValue(relationId),
  };
}
