import { useState } from "react";

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

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-background">
      <TableListPane
        filteredTables={filteredTables}
        searchValue={tableSearch}
        selectedTableName={currentTableName}
        tables={tables}
        onSearchValueChange={setTableSearch}
      />
      <SelectedTableView forcedDetailPaneMode={forcedDetailPaneMode} tableName={currentTableName} />
    </div>
  );
}
