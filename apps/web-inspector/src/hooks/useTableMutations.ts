import { useMemo, useState } from "react";

import { useDb } from "jazz-tools/react";

import { useInspector } from "@/components/providers/inspectorProvider";
import { createTableProxy } from "@/lib/table-explorer/tableProxy";

export interface UseTableMutationsResult {
  error: string | null;
  isPending: boolean;
  deleteRow: (rowId: string) => Promise<void>;
  insertRow: (values: Record<string, unknown>) => Promise<void>;
  updateRow: (rowId: string, values: Record<string, unknown>) => Promise<void>;
}

function omitUndefinedValues(values: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined));
}

export function useTableMutations(tableName: string): UseTableMutationsResult {
  const db = useDb();
  const { runtime } = useInspector();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tableProxy = useMemo(() => {
    if (runtime.wasmSchema === null) {
      return null;
    }

    return createTableProxy(tableName, runtime.wasmSchema);
  }, [runtime.wasmSchema, tableName]);

  const runMutation = async (callback: () => Promise<void>) => {
    try {
      setIsPending(true);
      setError(null);
      await callback();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : String(nextError));
      throw nextError;
    } finally {
      setIsPending(false);
    }
  };

  return {
    error,
    isPending,
    insertRow: async (values) => {
      if (tableProxy === null) {
        throw new Error("Schema is not loaded.");
      }

      await runMutation(async () => {
        await db.insert(tableProxy, omitUndefinedValues(values)).wait({ tier: "edge" });
      });
    },
    updateRow: async (rowId, values) => {
      if (tableProxy === null) {
        throw new Error("Schema is not loaded.");
      }

      await runMutation(async () => {
        await db.update(tableProxy, rowId, omitUndefinedValues(values)).wait({ tier: "edge" });
      });
    },
    deleteRow: async (rowId) => {
      if (tableProxy === null) {
        throw new Error("Schema is not loaded.");
      }

      await runMutation(async () => {
        await db.delete(tableProxy, rowId).wait({ tier: "edge" });
      });
    },
  };
}
