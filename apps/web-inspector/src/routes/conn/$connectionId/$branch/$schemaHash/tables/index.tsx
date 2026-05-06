import { createFileRoute } from "@tanstack/react-router";

import { InspectorLayout } from "@/components/layout/inspectorLayout";
import { useInspector } from "@/components/providers/inspectorProvider";

export const Route = createFileRoute("/conn/$connectionId/$branch/$schemaHash/tables/")({
  component: TablesRoute,
});

function TablesRoute(): React.ReactElement {
  const { connectionLabel, currentBranch, currentSchemaHash } = useInspector();

  return (
    <InspectorLayout>
      <section className="space-y-2 text-sm text-zinc-700">
        <h1 className="text-base font-medium text-zinc-950">Tables</h1>
        <p>{connectionLabel !== null ? connectionLabel : "No connection selected."}</p>
        <p>{currentBranch !== null ? `Branch: ${currentBranch}` : "No branch selected."}</p>
        <p>{currentSchemaHash !== null ? `Schema: ${currentSchemaHash}` : "No schema selected."}</p>
      </section>
    </InspectorLayout>
  );
}
