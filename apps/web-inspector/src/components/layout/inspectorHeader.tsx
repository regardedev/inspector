import { Button } from "@regarde/ui/button";
import { SidePanel } from "@regarde/ui/sidePanel";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { BranchSwitcher, ConnectionSwitcher, SchemaSwitcher } from "@/components/navigation";

export function InspectorHeader(): React.ReactElement {
  const tableListPane = SidePanel.useSidePanel();

  return (
    <header className="flex h-10 items-center gap-2 border-b border-border bg-secondary px-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="-ml-1"
        onClick={() => {
          tableListPane.toggle();
        }}
      >
        {tableListPane.open === true ? <PanelLeftClose /> : <PanelLeftOpen />}
        <span className="sr-only">Toggle table list</span>
      </Button>
      <div className="flex min-w-0 items-center gap-2">
        <ConnectionSwitcher triggerClassName="h-7 max-w-[280px] px-1" />
        <div className="flex min-w-0 items-center gap-1 text-secondary-foreground">
          <BranchSwitcher triggerClassName="h-7 max-w-[200px] px-1 text-secondary-foreground" />
          <span aria-hidden="true" className="shrink-0 text-secondary-foreground">
            /
          </span>
          <SchemaSwitcher triggerClassName="h-7 max-w-[280px] px-1 text-secondary-foreground" />
        </div>
      </div>
    </header>
  );
}
