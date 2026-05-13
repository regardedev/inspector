import type { TableFilterClause } from "@/types/tableFilters";

function buildRelationFilterClause(relationId: string): TableFilterClause {
  return {
    id: `relation-id-${relationId}`,
    column: "id",
    operator: "eq",
    value: relationId,
  };
}

export function buildRelationTableHref(input: {
  connectionId: string;
  branch: string;
  schemaHash: string;
  tableName: string;
  relationId: string;
}): string {
  const searchParams = new URLSearchParams();
  searchParams.set("filters", JSON.stringify([buildRelationFilterClause(input.relationId)]));
  searchParams.set("view", "data");

  return `/conn/${input.connectionId}/${input.branch}/${input.schemaHash}/tables/${input.tableName}?${searchParams.toString()}`;
}
