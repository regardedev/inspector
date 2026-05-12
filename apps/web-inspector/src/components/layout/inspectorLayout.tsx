import type { PropsWithChildren } from "react";

import { SidePanel } from "@regarde/ui/sidePanel";

import { inspectorShellStyle } from "#/layout/inspectorShell";

import { InspectorHeader } from "./inspectorHeader";
import { InspectorRail } from "./inspectorRail";

export function InspectorLayout({ children }: PropsWithChildren): React.ReactElement {
  return (
    <SidePanel.Provider defaultOpen={true}>
      <div className="flex min-h-svh w-full bg-background text-foreground" style={inspectorShellStyle}>
        <InspectorRail />
        <div className="flex min-h-svh min-w-0 flex-1 flex-col bg-background text-foreground">
          <InspectorHeader />
          <main className="flex min-h-0 flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </SidePanel.Provider>
  );
}
