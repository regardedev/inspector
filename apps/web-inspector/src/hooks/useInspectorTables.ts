import { useMemo } from "react";

import { useInspector } from "@/components/providers/inspectorProvider";
import { getTableNames } from "@/lib/table-explorer/tableSchema";

export interface UseInspectorTablesResult {
  tables: string[];
  filteredTables: string[];
  hasTables: boolean;
  isSchemaReady: boolean;
}

export function useInspectorTables(search = ""): UseInspectorTablesResult {
  const { runtime } = useInspector();

  return useMemo(() => {
    const tables = getTableNames(runtime.wasmSchema);
    const normalizedSearch = search.trim().toLowerCase();
    const filteredTables =
      normalizedSearch.length === 0
        ? tables
        : tables.filter((tableName) => tableName.toLowerCase().includes(normalizedSearch));

    return {
      tables,
      filteredTables,
      hasTables: tables.length > 0,
      isSchemaReady: runtime.wasmSchema !== null,
    };
  }, [runtime.wasmSchema, search]);
}
