import { useState } from "react";

import { ChevronDown, ChevronRight } from "lucide-react";
import {
  type ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  type ExpandedState,
  useReactTable,
} from "@tanstack/react-table";

import {
  DataGrid,
  DataGridContainer,
  DataGridScrollArea,
  DataGridTable,
} from "@regarde/ui/dataGrid";
import { Badge } from "@regarde/ui/badge";

import { ActionsBar } from "@/components/live-query/actionsBar";
import { LiveQueryExpandedRow } from "@/components/live-query/expandedRow";
import type { UseLiveQueryStateResult } from "@/components/live-query/useLiveQueryState";
import type { LiveQueryRow } from "@/types/liveQuery";

function getEmptyStateCopy(selectedTableName: string | null): {
  description: string;
  title: string;
} {
  if (selectedTableName !== null) {
    return {
      title: `No active subscriptions for ${selectedTableName}`,
      description: "Select another table or wait for a Jazz query to mount.",
    };
  }

  return {
    title: "No active subscriptions yet",
    description: "Subscriptions appear here after a Jazz query mounts and the server starts tracking it.",
  };
}

function HeaderLabel({ title }: { title: string }): React.ReactElement {
  return <span className="text-secondary-foreground/80 text-xs font-normal">{title}</span>;
}

function GridMessage({ description, title }: { description: string; title: string }): React.ReactElement {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

const columns: ColumnDef<LiveQueryRow>[] = [
  {
    id: "expander",
    size: 40,
    header: () => null,
    cell: ({ row }) => {
      const Icon = row.getIsExpanded() === true ? ChevronDown : ChevronRight;

      return (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            row.toggleExpanded();
          }}
          className="inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={row.getIsExpanded() === true ? "Collapse query row" : "Expand query row"}
        >
          <Icon className="size-4" />
        </button>
      );
    },
    meta: {
      expandedContent: (row) => <LiveQueryExpandedRow row={row} />,
      cellClassName: "w-10",
      headerClassName: "w-10",
    },
  },
  {
    accessorKey: "table",
    header: () => <HeaderLabel title="Table" />,
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.table}</span>,
  },
  {
    accessorKey: "propagation",
    header: () => <HeaderLabel title="Propagation" />,
    cell: ({ row }) => (
      <Badge variant="secondary" size="sm">
        {row.original.propagation}
      </Badge>
    ),
  },
  {
    accessorKey: "count",
    header: () => <HeaderLabel title="Count" />,
    cell: ({ row }) => <span className="tabular-nums text-foreground">{row.original.count}</span>,
  },
];

interface LiveQueryGridProps {
  state: UseLiveQueryStateResult;
}

export function LiveQueryGrid({ state }: LiveQueryGridProps): React.ReactElement {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const emptyStateCopy = getEmptyStateCopy(state.selectedTableName);

  const table = useReactTable({
    data: state.filteredRows,
    columns,
    state: { expanded },
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    getRowId: (row) => row.groupKey,
    onExpandedChange: setExpanded,
  });

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <ActionsBar
        error={state.error}
        generatedAt={state.generatedAt}
        hasRows={state.rows.length > 0}
        isRefreshing={state.isRefreshing}
      />
      {state.error !== null && state.rows.length === 0 && state.isInitialLoading === false ? (
        <GridMessage title="Unable to load subscription telemetry" description={state.error} />
      ) : state.isInitialLoading === true && state.rows.length === 0 ? (
        <GridMessage title="Loading subscriptions" description="Fetching active server subscriptions." />
      ) : state.filteredRows.length === 0 ? (
        <GridMessage title={emptyStateCopy.title} description={emptyStateCopy.description} />
      ) : (
        <div className="flex h-full min-h-0 min-w-0 flex-1 overflow-hidden bg-background">
          <DataGrid
            table={table}
            recordCount={state.filteredRows.length}
            emptyMessage="No active subscriptions"
            tableLayout={{
              headerSticky: true,
              width: "auto",
            }}
            className="flex h-full min-h-0 min-w-0 flex-1 flex-col"
          >
            <DataGridContainer className="flex h-full min-h-0 min-w-0 flex-1 flex-col rounded-none border-0">
              <DataGridScrollArea className="app-scrollbar h-full min-h-0 min-w-0 w-full flex-1 overflow-hidden" orientation="both">
                <DataGridTable />
              </DataGridScrollArea>
            </DataGridContainer>
          </DataGrid>
        </div>
      )}
    </div>
  );
}
