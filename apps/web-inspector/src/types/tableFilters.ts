export type TableFilterOperator =
  | "eq"
  | "ne"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "in"
  | "isNull";

export interface TableFilterClause {
  id: string;
  column: string;
  operator: TableFilterOperator;
  value: unknown;
}
