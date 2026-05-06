import type { PropsWithChildren } from "react";

import { InspectorHeader } from "./inspectorHeader";
import { InspectorSidebar } from "./inspectorSidebar";

export function InspectorLayout({ children }: PropsWithChildren): React.ReactElement {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <InspectorHeader />
      <div className="flex min-h-[calc(100vh-49px)]">
        <InspectorSidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
