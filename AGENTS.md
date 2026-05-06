## 1. Boolean Pattern (Golden Rule)

ALWAYS use explicit `=== true` and `=== false` comparisons. NEVER use implicit truthiness checks.

### Why Explicit Checks Matter

1. **Type Safety**: TypeScript's type narrowing behaves predictably with explicit comparisons
2. **Clarity**: Code reads like English - "if is valid equals true"
3. **Bug Prevention**: Falsy values (`0`, `""`, `null`, `undefined`) do not trigger unexpected branches
4. **Discipline**: One implicit check normalizes sloppy patterns; explicit checks enforce rigor

### Correct Examples

```typescript
const isConnectionLoaded = connection !== null && connection.$isLoaded === true;
if (isConnectionLoaded === false) {
  throw new Error("Connection not loaded");
}

const isBranchReady =
  branch !== null && branch !== undefined && branch.$isLoaded === true;
if (isBranchReady === false) {
  return null;
}

const hasTables = inspectorRoot.$jazz.has("tables") === true;
if (hasTables === false) {
  createTablesView();
}

const isSchemaLoaded =
  schema !== null && schema !== undefined && schema.$isLoaded === true;
if (isSchemaLoaded === false) {
  throw new Error("Schema not loaded");
}
```

### Incorrect Examples - Forbiden

```typescript
if (!connection.$isLoaded) {
  throw new Error("Not loaded");
}

if (connection) {
  processConnection(connection);
}

if (!inspectorRoot.$jazz.has("tables")) {
  createTablesView();
}

if (count) {
  renderRows();
}

if (!!isEnabled) {
  enableFeature();
}
```
