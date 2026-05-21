import { useMemo } from "react";

import { useInspector } from "@/components/providers/inspectorProvider";
import { getTableNames } from "@/lib/table-explorer/tableSchema";

export interface UseInspectorTablesResult {
  tables: string[];
  hasTables: boolean;
  isSchemaReady: boolean;
}

export function useInspectorTables(): UseInspectorTablesResult {
  const { runtime } = useInspector();

  return useMemo(() => {
    const tables = getTableNames(runtime.wasmSchema);

    return {
      tables,
      hasTables: tables.length > 0,
      isSchemaReady: runtime.wasmSchema !== null,
    };
  }, [runtime.wasmSchema]);
}
