import {
  DEFAULT_SERVER_URL,
  normalizeEnvName,
  type ConnectionDraft,
} from "./connections";

export interface PrefillConfig extends ConnectionDraft {}

export function readPrefillConfig(locationOverride?: Location): PrefillConfig | null {
  const location = locationOverride ?? globalThis.location;
  if (!location) {
    return null;
  }

  const searchParams = new URLSearchParams(location.search);
  const hashValue = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;
  const hashParams = new URLSearchParams(hashValue);
  const mergedParams = mergeSearchParams(searchParams, hashParams);
  // TODO: If we later support deep-linking route context, model it separately from connection draft prefill.
  const hasKnownPrefillParam = ["name", "serverUrl", "appId", "adminSecret", "env"].some(
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
  };
}

export function hasPrefillConfig(locationOverride?: Location): boolean {
  return readPrefillConfig(locationOverride) !== null;
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
