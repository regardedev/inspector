export const appRoutes = {
  connections: "/conn",
  newConnection: "/conn/new",
  connection: "/conn/$connectionId",
  branch: "/conn/$connectionId/$branch",
  schema: "/conn/$connectionId/$branch/$schemaHash",
  tables: "/conn/$connectionId/$branch/$schemaHash/tables",
  table: "/conn/$connectionId/$branch/$schemaHash/tables/$tableName",
  editTable: "/conn/$connectionId/$branch/$schemaHash/tables/$tableName/edit",
} as const;
