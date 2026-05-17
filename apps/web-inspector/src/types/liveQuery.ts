export interface LiveQueryRow {
  branches: string[];
  count: number;
  groupKey: string;
  propagation: string;
  query: string;
  table: string;
}

export interface LiveQueryTableItem {
  subscriptionCount: number;
  tableName: string;
}
