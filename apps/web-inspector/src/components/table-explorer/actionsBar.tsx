import { Layers, PanelLeftClose, PanelLeftOpen, TableIcon } from "lucide-react";

import { Button } from "@regarde/ui/button";
import { ButtonGroup, ButtonGroupItem } from "@regarde/ui/buttonGroup";
import { SidePanel } from "@regarde/ui/sidePanel";

import type { TableExplorerView } from "@/types/tableExplorer";

interface ActionsBarProps {
  children?: React.ReactNode;
  leftChildren?: React.ReactNode;
  onViewChange: (view: TableExplorerView) => void;
  view: TableExplorerView;
}

export function ActionsBar({
  children,
  leftChildren,
  onViewChange,
  view,
}: ActionsBarProps): React.ReactElement {
  const tableListPane = SidePanel.useSidePanel();

  return (
    <div className="flex min-h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-3 py-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            tableListPane.toggle();
          }}
        >
          {tableListPane.open === true ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
          <span className="sr-only">Toggle table list</span>
        </Button>
        <ButtonGroup>
          <ButtonGroupItem
            selected={view === "data"}
            aria-label="Show table data"
            title="Data"
            onClick={() => {
              void onViewChange("data");
            }}
          >
            <TableIcon className="size-3.5" />
          </ButtonGroupItem>
          <ButtonGroupItem
            selected={view === "schema"}
            aria-label="Show table schema"
            title="Schema"
            onClick={() => {
              void onViewChange("schema");
            }}
          >
            <Layers className="size-3.5" />
          </ButtonGroupItem>
        </ButtonGroup>
        {leftChildren}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
