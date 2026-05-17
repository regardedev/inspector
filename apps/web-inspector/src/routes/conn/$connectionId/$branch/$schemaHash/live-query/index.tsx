import { createFileRoute } from "@tanstack/react-router";

import { LiveQueryScreen } from "@/components/live-query/view";

export const Route = createFileRoute("/conn/$connectionId/$branch/$schemaHash/live-query/")({
  component: LiveQueryRoute,
});

function LiveQueryRoute(): React.ReactElement {
  return <LiveQueryScreen />;
}
