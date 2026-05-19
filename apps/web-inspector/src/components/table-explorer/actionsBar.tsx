import { Layers, ListFilter, PanelLeftClose, PanelLeftOpen, TableIcon } from "lucide-react";

import { Button } from "@regarde/ui/button";
import { ButtonGroup, ButtonGroupItem } from "@regarde/ui/buttonGroup";
import { Badge } from "@regarde/ui/badge";
import { cn } from "@regarde/ui/lib/utils";

import type { TableExplorerView } from "@/types/tableExplorer";

interface ActionsBarProps {
  children?: React.ReactNode;
  filterCount?: number;
  isListPaneOpen: boolean;
  isFilterOpen?: boolean;
  leftChildren?: React.ReactNode;
  onFilterOpenChange?: (open: boolean) => void;
  onToggleListPane: () => void;
  onViewChange: (view: TableExplorerView) => void;
  view: TableExplorerView;
}

export function ActionsBar({
  children,
  filterCount = 0,
  isFilterOpen = false,
  isListPaneOpen,
  leftChildren,
  onFilterOpenChange,
  onToggleListPane,
  onViewChange,
  view,
}: ActionsBarProps): React.ReactElement {
  const canShowFilters = onFilterOpenChange !== undefined;

  return (
    <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-3">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onToggleListPane}
        >
          {isListPaneOpen === true ? <PanelLeftClose /> : <PanelLeftOpen />}
          <span className="sr-only">Toggle table list</span>
        </Button>
        <ButtonGroup size="default">
          <ButtonGroupItem
            size="default"
            selected={view === "data"}
            aria-label="Show table data"
            title="Data"
            onClick={() => {
              void onViewChange("data");
            }}
          >
            <TableIcon />
          </ButtonGroupItem>
          <ButtonGroupItem
            size="default"
            selected={view === "schema"}
            aria-label="Show table schema"
            title="Schema"
            onClick={() => {
              void onViewChange("schema");
            }}
          >
            <Layers />
          </ButtonGroupItem>
        </ButtonGroup>
        {canShowFilters === true ? (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="relative"
            aria-pressed={isFilterOpen}
            title="Filters"
            onClick={() => {
              onFilterOpenChange(isFilterOpen === false);
            }}
          >
            <ListFilter />
            {filterCount > 0 ? (
              <Badge
                size="count"
                radius="full"
                className={cn(
                  "absolute -right-1 -top-1 border-background",
                  filterCount > 9 ? "min-w-5" : null,
                )}
              >
                {filterCount}
              </Badge>
            ) : null}
            <span className="sr-only">Toggle filters</span>
          </Button>
        ) : null}
        {leftChildren}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}
