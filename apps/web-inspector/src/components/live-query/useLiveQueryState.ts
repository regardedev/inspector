import { useMemo, useState } from "react";

import { useLiveQueryTelemetry } from "@/hooks/useLiveQueryTelemetry";
import type { LiveQueryRow, LiveQueryTableItem } from "@/types/liveQuery";

export interface UseLiveQueryStateResult {
  error: string | null;
  filteredRows: LiveQueryRow[];
  generatedAt: number | null;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  rows: LiveQueryRow[];
  searchValue: string;
  selectedTableName: string | null;
  setSearchValue: (value: string) => void;
  setSelectedTableName: (value: string | null) => void;
  tableItems: LiveQueryTableItem[];
}

export function useLiveQueryState(): UseLiveQueryStateResult {
  const telemetry = useLiveQueryTelemetry();
  const [searchValue, setSearchValue] = useState("");
  const [selectedTableName, setSelectedTableName] = useState<string | null>(null);

  const tableItems = useMemo<LiveQueryTableItem[]>(() => {
    const subscriptionCountByTable = new Map<string, number>();

    for (const row of telemetry.rows) {
      subscriptionCountByTable.set(row.table, (subscriptionCountByTable.get(row.table) ?? 0) + row.count);
    }

    return [...subscriptionCountByTable.entries()]
      .sort(([leftTableName], [rightTableName]) => leftTableName.localeCompare(rightTableName))
      .map(([tableName, subscriptionCount]) => ({ tableName, subscriptionCount }));
  }, [telemetry.rows]);

  const normalizedSearchValue = searchValue.trim().toLowerCase();
  const visibleTableItems = useMemo(() => {
    if (normalizedSearchValue.length === 0) {
      return tableItems;
    }

    return tableItems.filter((tableItem) => tableItem.tableName.toLowerCase().includes(normalizedSearchValue));
  }, [normalizedSearchValue, tableItems]);

  const filteredRows = useMemo(() => {
    return telemetry.rows.filter((row) => {
      if (selectedTableName !== null && row.table !== selectedTableName) {
        return false;
      }

      if (normalizedSearchValue.length > 0 && row.table.toLowerCase().includes(normalizedSearchValue) === false) {
        return false;
      }

      return true;
    });
  }, [normalizedSearchValue, selectedTableName, telemetry.rows]);

  return {
    rows: telemetry.rows,
    filteredRows,
    tableItems: visibleTableItems,
    generatedAt: telemetry.generatedAt,
    error: telemetry.error,
    isInitialLoading: telemetry.isInitialLoading,
    isRefreshing: telemetry.isRefreshing,
    searchValue,
    selectedTableName,
    setSearchValue,
    setSelectedTableName,
  };
}
