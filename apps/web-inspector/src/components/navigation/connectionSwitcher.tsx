import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { Button } from "@regarde/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxSeparator,
  useComboboxAnchor,
} from "@regarde/ui/combobox";

import { useInspector } from "@/components/providers/inspectorProvider";
import {
  getConnectionDisplayName,
  getConnectionSecondaryLabel,
  type StoredConnection,
} from "@/lib/config/connections";
import { appRoutes } from "@/lib/navigation/appRoutes";

interface ConnectionSwitcherProps {
  triggerLabel?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

function sortConnections(
  connections: StoredConnection[],
  currentConnectionId: string | null,
): StoredConnection[] {
  const activeConnections = connections.filter((connection) => connection.id === currentConnectionId);
  const inactiveConnections = connections.filter((connection) => connection.id !== currentConnectionId);

  return [...activeConnections, ...inactiveConnections];
}

export function ConnectionSwitcher({
  triggerLabel,
  triggerClassName,
  contentClassName,
}: ConnectionSwitcherProps = {}): React.ReactElement {
  const { connections, currentConnectionId, openConnection } = useInspector();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const anchorRef = useComboboxAnchor();

  const orderedConnections = useMemo(
    () => sortConnections(connections, currentConnectionId),
    [connections, currentConnectionId],
  );
  const activeConnection = orderedConnections[0] ?? null;
  const resolvedTriggerLabel =
    triggerLabel ??
    (activeConnection !== null && activeConnection.id === currentConnectionId
      ? getConnectionDisplayName(activeConnection)
      : "Open Connections");
  const resolvedTriggerClassName =
    triggerClassName !== undefined
      ? `justify-start rounded-xs ${triggerClassName}`
      : "justify-start rounded-xs";

  const filteredConnections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length === 0) {
      return orderedConnections;
    }

    return orderedConnections.filter((connection) => {
      const searchableText = [connection.name, connection.appId].join(" ").toLowerCase();
      return searchableText.includes(normalizedQuery);
    });
  }, [orderedConnections, query]);

  return (
    <Combobox<StoredConnection>
      items={filteredConnections}
      itemToStringValue={(connection) => getConnectionDisplayName(connection)}
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen === false) {
          setQuery("");
        }
      }}
    >
      <div ref={anchorRef} className="inline-flex shrink-0">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={true}
          className={resolvedTriggerClassName}
          render={<ComboboxTrigger />}
        >
          {resolvedTriggerLabel}
        </Button>
      </div>
      <ComboboxContent anchor={anchorRef} className={contentClassName ?? "w-90 p-0"}>
        <div className="sticky top-0 z-20 bg-popover p-1">
          <ComboboxInput
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            onFocus={() => {
              setOpen(true);
            }}
            placeholder="Search connections..."
            aria-label="Search connections"
            showClear={false}
            showTrigger={false}
          />
        </div>
        <ComboboxSeparator />
        <ComboboxEmpty>No saved connections.</ComboboxEmpty>
        <div className="max-h-80 overflow-y-auto">
          <ComboboxList className="max-h-none overflow-visible">
            {(connection) => {
              const isCurrentConnection = currentConnectionId === connection.id;
              return (
                <ComboboxItem
                  key={connection.id}
                  value={connection}
                  onClick={() => {
                    setOpen(false);
                    void openConnection(connection.id);
                  }}
                >
                  <div className="flex w-full min-w-0 items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="truncate text-sm text-foreground">
                        {getConnectionDisplayName(connection)}
                      </span>
                      <span className="truncate text-[12px] leading-4 text-muted-foreground">
                        {getConnectionSecondaryLabel(connection)}
                      </span>
                    </div>
                    {isCurrentConnection === true ? (
                      <span className="shrink-0 text-[11px] leading-4 tracking-wide text-muted-foreground uppercase">
                        Active
                      </span>
                    ) : null}
                  </div>
                </ComboboxItem>
              );
            }}
          </ComboboxList>
        </div>
        <ComboboxSeparator />
        <div className="p-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto w-full justify-start"
            onClick={() => {
              setOpen(false);
              void navigate({ to: appRoutes.newConnection });
            }}
          >
            Add New Connection
          </Button>
        </div>
      </ComboboxContent>
    </Combobox>
  );
}
