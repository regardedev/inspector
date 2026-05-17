import { Link } from "@tanstack/react-router";

import { Button } from "@regarde/ui/button";

import { useInspector } from "@/components/providers/inspectorProvider";
import { buildExplorerUrl } from "@/lib/live-query/buildExplorerUrl";
import type { LiveQueryRow } from "@/types/liveQuery";

interface LiveQueryExpandedRowProps {
  row: LiveQueryRow;
}

export function LiveQueryExpandedRow({ row }: LiveQueryExpandedRowProps): React.ReactElement {
  const { currentBranch, currentConnectionId, currentSchemaHash } = useInspector();

  let formattedQuery = row.query;

  try {
    formattedQuery = JSON.stringify(JSON.parse(row.query), null, 2);
  } catch {
    formattedQuery = row.query;
  }

  const explorerUrl =
    currentConnectionId !== null && currentBranch !== null && currentSchemaHash !== null
      ? buildExplorerUrl({
          connectionId: currentConnectionId,
          branch: currentBranch,
          schemaHash: currentSchemaHash,
          tableName: row.table,
          query: row.query,
        })
      : null;

  return (
    <div className="flex flex-col gap-4 border-t border-border bg-muted/20 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Query</p>
          <p className="text-xs text-muted-foreground">Grouped server subscription for `{row.table}`.</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {explorerUrl !== null ? (
            <Button size="default" variant="secondary" render={<Link to={explorerUrl} />}>
              Open in table explorer
            </Button>
          ) : null}
          <Button
            type="button"
            size="default"
            variant="secondary"
            onClick={() => {
              void navigator.clipboard.writeText(row.query);
            }}
          >
            Copy query
          </Button>
        </div>
      </div>
      <pre className="app-scrollbar max-w-full overflow-x-auto rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">{formattedQuery}</pre>
    </div>
  );
}
