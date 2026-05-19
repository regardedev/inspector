import { appRoutes } from "@/lib/navigation/appRoutes";

import { extractFiltersFromIR } from "./extractFiltersFromIR";

interface BuildExplorerLinkOptions {
  branch: string;
  connectionId: string;
  query: string;
  schemaHash: string;
  tableName: string;
}

export function buildExplorerLink({
  branch,
  connectionId,
  query,
  schemaHash,
  tableName,
}: BuildExplorerLinkOptions) {
  const link = {
    to: appRoutes.table,
    params: {
      connectionId,
      branch,
      schemaHash,
      tableName,
    },
  } as const;

  try {
    const parsedQuery = JSON.parse(query) as { relation_ir?: unknown };
    const filters = extractFiltersFromIR(parsedQuery.relation_ir);

    if (filters.length === 0) {
      return link;
    }

    return {
      ...link,
      search: {
        filters: JSON.stringify(filters),
      },
    } as const;
  } catch {
    return link;
  }
}
