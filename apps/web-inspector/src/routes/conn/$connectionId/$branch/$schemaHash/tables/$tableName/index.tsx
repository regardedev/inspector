import { createFileRoute } from "@tanstack/react-router";

import { Workspace } from "@/components/table-explorer/workspace";

export const Route = createFileRoute("/conn/$connectionId/$branch/$schemaHash/tables/$tableName/")({
  component: TableDataRoute,
});

function TableDataRoute(): React.ReactElement {
  return <Workspace />;
}
