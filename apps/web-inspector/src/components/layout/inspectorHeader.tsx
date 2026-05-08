import { BranchSwitcher, ConnectionSwitcher, SchemaSwitcher } from "@/components/navigation";

export function InspectorHeader(): React.ReactElement {
  return (
    <header className="flex h-10 items-center border-b border-border bg-secondary px-3">
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
