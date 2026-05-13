export function parseBooleanValue(value: string): boolean | null {
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "true" || normalizedValue === "1") {
    return true;
  }

  if (normalizedValue === "false" || normalizedValue === "0") {
    return false;
  }

  return null;
}
