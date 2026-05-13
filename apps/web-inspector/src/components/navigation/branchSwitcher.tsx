import { useMemo, useState } from "react";
import { SplitIcon } from "lucide-react";

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

interface BranchSwitcherProps {
  triggerLabel?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function BranchSwitcher({
  triggerLabel,
  triggerClassName,
  contentClassName,
}: BranchSwitcherProps = {}): React.ReactElement {
  const { currentBranch, rememberedBranches, switchBranch } = useInspector();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const anchorRef = useComboboxAnchor();

  const branches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length === 0) {
      return rememberedBranches;
    }

    return rememberedBranches.filter((branch) => branch.toLowerCase().includes(normalizedQuery));
  }, [query, rememberedBranches]);
  const resolvedTriggerClassName =
    triggerClassName !== undefined
      ? `justify-start gap-2 rounded-sm ${triggerClassName}`
      : "justify-start gap-2 rounded-sm";

  return (
    <Combobox<string>
      items={branches}
      value={currentBranch ?? undefined}
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
          <SplitIcon className="size-3.5 rotate-90 text-current" />
          <span className="truncate">{triggerLabel ?? currentBranch ?? "Select branch"}</span>
        </Button>
      </div>
      <ComboboxContent anchor={anchorRef} className={contentClassName ?? "w-[320px] p-0"}>
        <div className="sticky top-0 z-10 bg-popover p-1">
          <ComboboxInput
            value={query}
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
            onFocus={() => {
              setOpen(true);
            }}
            placeholder="Search branch..."
            aria-label="Search branch"
            showClear={false}
            showTrigger={false}
          />
        </div>
        <ComboboxSeparator />
        <ComboboxEmpty>No remembered branches.</ComboboxEmpty>
        <ComboboxList className="max-h-80">
          {(branch) => (
            <ComboboxItem
              key={branch}
              value={branch}
              onClick={() => {
                setOpen(false);
                void switchBranch(branch);
              }}
            >
              <span className="truncate">{branch}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
