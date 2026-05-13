import { createFileRoute } from "@tanstack/react-router";

import { TableExplorerScreen } from "@/components/table-explorer/tableExplorerScreen";

export const Route = createFileRoute("/conn/$connectionId/$branch/$schemaHash/tables/$tableName/edit")({
  component: EditTableRoute,
});

function EditTableRoute(): React.ReactElement {
  return <TableExplorerScreen forcedDetailPaneMode="edit" />;
}
