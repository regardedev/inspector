export const appRoutes = {
  connections: "/conn",
  newConnection: "/conn/new",
  connection: "/conn/$connectionId",
  branch: "/conn/$connectionId/$branch",
  schema: "/conn/$connectionId/$branch/$schemaHash",
  tables: "/conn/$connectionId/$branch/$schemaHash/tables",
  liveQuery: "/conn/$connectionId/$branch/$schemaHash/live-query",
  table: "/conn/$connectionId/$branch/$schemaHash/tables/$tableName",
} as const;
