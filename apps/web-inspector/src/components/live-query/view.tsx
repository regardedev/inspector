import { useRef, useState } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

import { ResizableGroup, ResizablePanel, ResizableSeparator } from "@regarde/ui/resizablePanel";

import { LiveQueryGrid } from "@/components/live-query/dataGrid";
import { LiveQueryListPane } from "@/components/live-query/tableListPane";
import { useLiveQueryState } from "@/components/live-query/useLiveQueryState";

export function LiveQueryScreen(): React.ReactElement {
  const state = useLiveQueryState();
  const listPaneRef = useRef<PanelImperativeHandle>(null);
  const [isListPaneOpen, setIsListPaneOpen] = useState(true);

  const handleListPaneResize = (size: number) => {
    setIsListPaneOpen(size > 0);
  };

  const handleToggleListPane = () => {
    const panel = listPaneRef.current;
    if (panel === null) {
      return;
    }
    if (panel.isCollapsed() === true) {
      panel.expand();
      setIsListPaneOpen(true);
    } else {
      panel.collapse();
      setIsListPaneOpen(false);
    }
  };

  return (
    <ResizableGroup direction="horizontal" className="min-w-0 bg-background">
      <ResizablePanel
        className="min-w-0 overflow-hidden"
        panelRef={listPaneRef}
        collapsible
        collapsedSize={0}
        defaultSize={200}
        minSize={160}
        maxSize={360}
        onResize={handleListPaneResize}
      >
        <LiveQueryListPane
          isInitialLoading={state.isInitialLoading}
          listSearchValue={state.listSearchValue}
          selectedTableName={state.selectedTableName}
          visibleTableItems={state.visibleTableItems}
          onListSearchValueChange={state.setListSearchValue}
          onSelectedTableNameChange={state.setSelectedTableName}
        />
      </ResizablePanel>
      <ResizableSeparator />
      <ResizablePanel className="min-w-0 overflow-hidden">
        <LiveQueryGrid state={state} isListPaneOpen={isListPaneOpen} onToggleListPane={handleToggleListPane} />
      </ResizablePanel>
    </ResizableGroup>
  );
}
