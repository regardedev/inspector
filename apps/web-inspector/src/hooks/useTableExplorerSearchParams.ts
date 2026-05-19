import { useMemo } from "react";

import { useNavigate, useSearch } from "@tanstack/react-router";

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
  const navigate = useNavigate();
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

    if (nextSearch.view === "data" || nextSearch.view === undefined) {
      delete nextSearch.view;
    }
    if (nextSearch.sort === "id" || nextSearch.sort === undefined) {
      delete nextSearch.sort;
    }
    if (nextSearch.dir === "asc" || nextSearch.dir === undefined) {
      delete nextSearch.dir;
    }
    if (nextSearch.filters === null || nextSearch.filters === undefined) {
      delete nextSearch.filters;
    }

    return nextSearch;
  };

  const updateSearch = async (updates: Partial<SearchValues>): Promise<void> => {
    await navigate({
      replace: true,
      search: () => createNextSearch(updates),
    });
  };

  return {
    ...state,
    setView: async (view) => {
      await updateSearch({ view });
    },
    setFilters: async (filters) => {
      await updateSearch({ filters: serializeFiltersToSearchParam(filters) ?? undefined });
    },
    setSorting: async (sortColumn, sortDirection) => {
      await updateSearch({ sort: sortColumn, dir: sortDirection });
    },
  };
}
