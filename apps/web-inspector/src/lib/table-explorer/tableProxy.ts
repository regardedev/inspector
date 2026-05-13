import type { DynamicTableRow, TableProxy, WasmSchema } from "jazz-tools";

export function createTableProxy(
  tableName: string,
  schema: WasmSchema,
): TableProxy<DynamicTableRow, Record<string, unknown>> {
  return {
    _table: tableName,
    _schema: schema,
    _rowType: undefined as unknown as DynamicTableRow,
    _initType: undefined as unknown as Record<string, unknown>,
  } as TableProxy<DynamicTableRow, Record<string, unknown>>;
}
