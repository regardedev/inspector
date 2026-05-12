import { ConnectionSwitcher } from "@/components/navigation";
import { inspectorShellStyle } from "#/layout/inspectorShell";

import { ConnectionsHomePage } from "./connectionsHomePage";

interface ConnectionsLayoutProps {
  sheet: React.ReactNode;
}

export function ConnectionsLayout({ sheet }: ConnectionsLayoutProps): React.ReactElement {
  const hasSheet = sheet !== null && sheet !== undefined;

  return (
    <div className="flex min-h-screen w-full flex-col" style={inspectorShellStyle}>
      <header className="flex h-9 w-full items-center border-b border-border bg-secondary px-3 py-1">
        <ConnectionSwitcher triggerClassName="h-7 rounded-xs px-2" />
      </header>
      <div className="flex min-h-0 flex-1 flex-col justify-between lg:flex-row">
        <ConnectionsHomePage />
        {hasSheet === true ? sheet : null}
      </div>
    </div>
  );
}
