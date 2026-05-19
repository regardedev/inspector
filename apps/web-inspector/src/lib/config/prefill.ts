import {
  DEFAULT_BRANCH_NAME,
  DEFAULT_SERVER_URL,
  normalizeBranchName,
  normalizeEnvName,
  type ConnectionDraft,
} from "./connections";

export interface PrefillConfig extends ConnectionDraft {
  branch: string;
}

export function readPrefillConfig(locationOverride?: Location): PrefillConfig | null {
  const location = locationOverride ?? globalThis.location;
  if (!location) {
    return null;
  }

  const searchParams = new URLSearchParams(location.search);
  const hashValue = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;
  const hashParams = new URLSearchParams(hashValue);
  const mergedParams = mergeSearchParams(searchParams, hashParams);
  const hasKnownPrefillParam = ["name", "serverUrl", "appId", "adminSecret", "env", "branch"].some(
    (key) => mergedParams.has(key),
  );

  if (!hasKnownPrefillParam) {
    return null;
  }

  return {
    name: (mergedParams.get("name") ?? "").trim(),
    serverUrl: (mergedParams.get("serverUrl") ?? DEFAULT_SERVER_URL).trim() || DEFAULT_SERVER_URL,
    appId: (mergedParams.get("appId") ?? "").trim(),
    adminSecret: (mergedParams.get("adminSecret") ?? "").trim(),
    env: normalizeEnvName(mergedParams.get("env")),
    branch: normalizeBranchName(mergedParams.get("branch") ?? DEFAULT_BRANCH_NAME),
  };
}

function mergeSearchParams(searchParams: URLSearchParams, hashParams: URLSearchParams): URLSearchParams {
  const mergedParams = new URLSearchParams(searchParams);

  for (const [key, value] of hashParams.entries()) {
    if (!mergedParams.has(key)) {
      mergedParams.set(key, value);
    }
  }

  return mergedParams;
}
