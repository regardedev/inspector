import { type ConnectionDraft, type StoredConnection } from "@/lib/config/connections";

function normalizeServerUrl(serverUrl: string): string {
  return serverUrl.trim().replace(/\/+$/u, "");
}

function normalizeCredentialField(value: string): string {
  return value.trim();
}

export function matchesConnectionCredentials(
  connection: Pick<StoredConnection, "serverUrl" | "appId" | "adminSecret">,
  draft: Pick<ConnectionDraft, "serverUrl" | "appId" | "adminSecret">,
): boolean {
  return (
    normalizeServerUrl(connection.serverUrl) === normalizeServerUrl(draft.serverUrl) &&
    normalizeCredentialField(connection.appId) === normalizeCredentialField(draft.appId) &&
    normalizeCredentialField(connection.adminSecret) === normalizeCredentialField(draft.adminSecret)
  );
}

export function findConnectionByCredentials(
  connections: StoredConnection[],
  draft: Pick<ConnectionDraft, "serverUrl" | "appId" | "adminSecret">,
): StoredConnection | null {
  return connections.find((connection) => matchesConnectionCredentials(connection, draft)) ?? null;
}
