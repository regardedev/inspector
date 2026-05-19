import type { TableFilterClause } from "@/types/tableFilters";
import { appRoutes } from "@/lib/navigation/appRoutes";

function buildRelationFilterClause(relationId: string): TableFilterClause {
  return {
    id: `relation-id-${relationId}`,
    column: "id",
    operator: "eq",
    value: relationId,
  };
}

export function buildRelationTableLink(input: {
  connectionId: string;
  branch: string;
  schemaHash: string;
  tableName: string;
  relationId: string;
}) {
  return {
    to: appRoutes.table,
    params: {
      connectionId: input.connectionId,
      branch: input.branch,
      schemaHash: input.schemaHash,
      tableName: input.tableName,
    },
    search: {
      filters: JSON.stringify([buildRelationFilterClause(input.relationId)]),
      view: "data",
    },
  } as const;
}
