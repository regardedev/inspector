const LOCAL_INSPECTOR_URL = "http://regarde.inspector.localhost:1355/conn/new";

function encodeFragmentValue(value: string): string {
  return encodeURIComponent(value);
}

export function buildJazzInspectorLink(serverUrl: string, appId: string, adminSecret: string): string {
  return (
    `${LOCAL_INSPECTOR_URL}#serverUrl=${encodeFragmentValue(serverUrl)}` +
    `&appId=${encodeFragmentValue(appId)}` +
    `&adminSecret=${encodeFragmentValue(adminSecret)}`
  );
}

export { LOCAL_INSPECTOR_URL };
