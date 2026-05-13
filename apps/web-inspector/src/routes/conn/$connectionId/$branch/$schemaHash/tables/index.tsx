import { createFileRoute } from "@tanstack/react-router";

import { TableExplorerScreen } from "@/components/table-explorer/tableExplorerScreen";

export const Route = createFileRoute("/conn/$connectionId/$branch/$schemaHash/tables/")({
  component: TablesRoute,
});

function TablesRoute(): React.ReactElement {
  return <TableExplorerScreen />;
}
