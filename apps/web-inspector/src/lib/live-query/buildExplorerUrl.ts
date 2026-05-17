import { appRoutes } from "@/lib/navigation/appRoutes";

import { extractFiltersFromIR } from "./extractFiltersFromIR";

interface BuildExplorerUrlOptions {
  branch: string;
  connectionId: string;
  query: string;
  schemaHash: string;
  tableName: string;
}

export function buildExplorerUrl({
  branch,
  connectionId,
  query,
  schemaHash,
  tableName,
}: BuildExplorerUrlOptions): string {
  const basePath = appRoutes.table
    .replace("$connectionId", connectionId)
    .replace("$branch", branch)
    .replace("$schemaHash", schemaHash)
    .replace("$tableName", tableName);

  try {
    const parsedQuery = JSON.parse(query) as { relation_ir?: unknown };
    const filters = extractFiltersFromIR(parsedQuery.relation_ir);

    if (filters.length === 0) {
      return basePath;
    }

    const params = new URLSearchParams();
    params.set("filters", JSON.stringify(filters));
    return `${basePath}?${params.toString()}`;
  } catch {
    return basePath;
  }
}
