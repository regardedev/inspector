import { useMemo } from "react";

import { useSearch } from "@tanstack/react-router";

import {
  parseFiltersFromSearchParam,
  serializeFiltersToSearchParam,
} from "@/lib/table-explorer/filterParsing";
import type { TableFilterClause } from "@/types/tableFilters";
import type {
  TableExplorerSearchState,
  TableExplorerView,
  TableSortDirection,
} from "@/types/tableExplorer";

interface SearchValues {
  dir?: string;
  filters?: string;
  sort?: string;
  view?: string;
}

export interface UseTableExplorerSearchParamsResult extends TableExplorerSearchState {
  setFilters: (filters: TableFilterClause[]) => Promise<void>;
  setSorting: (sortColumn: string, sortDirection: TableSortDirection) => Promise<void>;
  setView: (view: TableExplorerView) => Promise<void>;
}

function parseView(value: string | undefined): TableExplorerView {
  return value === "schema" ? "schema" : "data";
}

function parseSortDirection(value: string | undefined): TableSortDirection {
  return value === "desc" ? "desc" : "asc";
}

export function useTableExplorerSearchParams(): UseTableExplorerSearchParamsResult {
  const search = useSearch({ strict: false }) as SearchValues;

  const state = useMemo<TableExplorerSearchState>(() => {
    return {
      view: parseView(search.view),
      filters: parseFiltersFromSearchParam(search.filters ?? null),
      sortColumn: search.sort ?? "id",
      sortDirection: parseSortDirection(search.dir),
    };
  }, [search.dir, search.filters, search.sort, search.view]);

  const createNextSearch = (updates: Partial<SearchValues>): SearchValues => {
    const nextSearch: SearchValues = {
      dir: search.dir,
      filters: search.filters,
      sort: search.sort,
      view: search.view,
      ...updates,
    };

    if (nextSearch.view === "data") {
      delete nextSearch.view;
    }
    if (nextSearch.sort === "id") {
      delete nextSearch.sort;
    }
    if (nextSearch.dir === "asc") {
      delete nextSearch.dir;
    }
    if (nextSearch.filters === null || nextSearch.filters === undefined) {
      delete nextSearch.filters;
    }

    return nextSearch;
  };

  return {
    ...state,
    setView: async (view) => {
      window.history.replaceState(null, "", `?${new URLSearchParams(createNextSearch({ view })).toString()}`);
    },
    setFilters: async (filters) => {
      window.history.replaceState(
        null,
        "",
        `?${new URLSearchParams(createNextSearch({ filters: serializeFiltersToSearchParam(filters) ?? undefined })).toString()}`,
      );
    },
    setSorting: async (sortColumn, sortDirection) => {
      window.history.replaceState(
        null,
        "",
        `?${new URLSearchParams(createNextSearch({ sort: sortColumn, dir: sortDirection })).toString()}`,
      );
    },
  };
}
