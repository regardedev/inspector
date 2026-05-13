import { useMemo } from "react";

import { ActionsBar } from "@/components/table-explorer/actionsBar";
import { useInspector } from "@/components/providers/inspectorProvider";
import { getTableColumns } from "@/lib/table-explorer/tableSchema";
import type { TableExplorerView } from "@/types/tableExplorer";

interface SchemaViewProps {
  onViewChange: (view: TableExplorerView) => Promise<void>;
  tableName: string;
  view: TableExplorerView;
}

export function SchemaView({ onViewChange, tableName, view }: SchemaViewProps): React.ReactElement {
  const { runtime } = useInspector();
  const tableSchema = useMemo(() => {
    return runtime.wasmSchema?.[tableName] ?? null;
  }, [runtime.wasmSchema, tableName]);
  const tablePermissions = useMemo(() => {
    return runtime.storedPermissions?.permissions?.[tableName] ?? null;
  }, [runtime.storedPermissions, tableName]);
  const columns = useMemo(() => getTableColumns(runtime.wasmSchema, tableName), [runtime.wasmSchema, tableName]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <ActionsBar view={view} onViewChange={onViewChange} />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-auto p-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section className="rounded-sm border border-border bg-background p-4">
          <p className="mb-3 text-sm font-medium text-foreground">Columns</p>
          <div className="flex flex-col gap-3">
            {columns.map((column) => (
              <div key={column.name} className="rounded-sm border border-border px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-foreground">{column.name}</span>
                  <span className="text-xs text-muted-foreground">{column.column_type.type}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{column.nullable === true ? "nullable" : "required"}</span>
                  {column.references !== undefined ? <span>references {column.references}</span> : null}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="flex min-h-0 flex-col gap-4">
          <div className="min-h-0 rounded-sm border border-border bg-background p-4">
            <p className="mb-3 text-sm font-medium text-foreground">Schema JSON</p>
            <pre className="overflow-auto text-xs text-muted-foreground">{JSON.stringify({ [tableName]: tableSchema }, null, 2)}</pre>
          </div>
          <div className="min-h-0 rounded-sm border border-border bg-background p-4">
            <p className="mb-3 text-sm font-medium text-foreground">Permissions JSON</p>
            <pre className="overflow-auto text-xs text-muted-foreground">{JSON.stringify({ [tableName]: tablePermissions }, null, 2)}</pre>
          </div>
        </section>
      </div>
    </div>
  );
}
