import { createFileRoute } from "@tanstack/react-router";

import { Workspace } from "@/components/table-explorer/workspace";

export const Route = createFileRoute("/conn/$connectionId/$branch/$schemaHash/tables/$tableName/edit")({
  component: EditTableRoute,
});

function EditTableRoute(): React.ReactElement {
  return <Workspace forcedDetailPaneMode="edit" />;
}
