import { useRef, useState } from "react";
import type { PanelImperativeHandle } from "react-resizable-panels";

import { ResizableGroup, ResizablePanel, ResizableSeparator } from "@regarde/ui/resizablePanel";

import { SelectedTableView } from "@/components/table-explorer/selectedTableView";
import { TableListPane } from "@/components/table-explorer/tableListPane";
import { useInspector } from "@/components/providers/inspectorProvider";
import { useInspectorTables } from "@/hooks/useInspectorTables";
import type { DetailPaneMode } from "@/types/tableExplorer";

interface TableExplorerScreenProps {
  forcedDetailPaneMode?: DetailPaneMode | null;
}

export function TableExplorerScreen({
  forcedDetailPaneMode = null,
}: TableExplorerScreenProps): React.ReactElement {
  const { currentTableName } = useInspector();
  const [tableSearch, setTableSearch] = useState("");
  const { filteredTables, tables } = useInspectorTables(tableSearch);
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
    <ResizableGroup direction="horizontal" className="bg-background">
      <ResizablePanel
        panelRef={listPaneRef}
        collapsible
        collapsedSize={0}
        defaultSize={200}
        minSize={160}
        maxSize={360}
        onResize={handleListPaneResize}
      >
        <TableListPane
          filteredTables={filteredTables}
          searchValue={tableSearch}
          selectedTableName={currentTableName}
          tables={tables}
          onSearchValueChange={setTableSearch}
        />
      </ResizablePanel>
      <ResizableSeparator />
      <ResizablePanel>
        <SelectedTableView
          forcedDetailPaneMode={forcedDetailPaneMode}
          isListPaneOpen={isListPaneOpen}
          tableName={currentTableName}
          onToggleListPane={handleToggleListPane}
        />
      </ResizablePanel>
    </ResizableGroup>
  );
}
