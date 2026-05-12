import { EllipsisIcon, ListFilterIcon, PlusIcon } from "lucide-react";

import { Button } from "@regarde/ui/button";
import { DataTableToolbar } from "@regarde/ui/dataTable";

interface ToolbarProps {
  filterCount: number;
  onInsertRow: () => void;
  onOpenFilters: () => void;
}

export function Toolbar({ filterCount, onInsertRow, onOpenFilters }: ToolbarProps): React.ReactElement {
  const filterButtonLabel = filterCount > 0 ? `Filter (${filterCount})` : "Filter";

  return (
    <DataTableToolbar>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon-sm" aria-label="Open filters" onClick={onOpenFilters}>
          <ListFilterIcon className="size-3.5" />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onOpenFilters}>
          {filterButtonLabel}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onInsertRow}>
          <PlusIcon className="size-3.5" />
          Insert Row
        </Button>
      </div>
      <Button type="button" variant="ghost" size="icon-sm" aria-label="More actions">
        <EllipsisIcon className="size-3.5" />
      </Button>
    </DataTableToolbar>
  );
}
