import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@regarde/ui/button";
import { SidePanel } from "@regarde/ui/sidePanel";

interface ActionsBarProps {
  error: string | null;
  generatedAt: number | null;
  hasRows: boolean;
  isRefreshing: boolean;
}

function formatLastRefresh(generatedAt: number | null): string {
  if (generatedAt === null) {
    return "Polling every 20s.";
  }

  return `Polling every 20s. Last refresh ${new Date(generatedAt).toLocaleTimeString()}.`;
}

export function ActionsBar({
  error,
  generatedAt,
  hasRows,
  isRefreshing,
}: ActionsBarProps): React.ReactElement {
  const liveQueryListPane = SidePanel.useSidePanel();
  const statusText = `${formatLastRefresh(generatedAt)}${isRefreshing === true ? " Refreshing..." : ""}`;

  return (
    <div className="flex min-h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-3 py-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            liveQueryListPane.toggle();
          }}
        >
          {liveQueryListPane.open === true ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
          <span className="sr-only">Toggle live query table list</span>
        </Button>
      </div>
      <div className="text-right text-xs text-muted-foreground">
        <p>{statusText}</p>
        {error !== null && hasRows === true ? <p>{error}</p> : null}
      </div>
    </div>
  );
}
