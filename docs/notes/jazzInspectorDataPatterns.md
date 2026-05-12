# Jazz Inspector Data Patterns

## Table of Contents

- [Summary](#summary)
- [Official data flow](#official-data-flow)
- [How table data is subscribed](#how-table-data-is-subscribed)
- [How filters sorting and paging are modeled](#how-filters-sorting-and-paging-are-modeled)
- [How relations are resolved](#how-relations-are-resolved)
- [How mutations work](#how-mutations-work)
- [How schema metadata drives the UI](#how-schema-metadata-drives-the-ui)
- [What we should reuse conceptually](#what-we-should-reuse-conceptually)
- [What we should not copy as-is](#what-we-should-not-copy-as-is)
- [Recommendation for Regarde inspector](#recommendation-for-regarde-inspector)

## Summary

The official Jazz inspector does not use a hidden inspector-only data API. It uses normal Jazz runtime primitives and builds a generic schema-driven UI on top of them.

Core primitives:

- `createJazzClient(...)`
- `fetchStoredWasmSchema(...)`
- `fetchSchemaHashes(...)`
- `fetchStoredPermissions(...)`
- `useAll(...)`
- `useDb()`

The main architectural idea is simple:

1. bootstrap a Jazz client
2. load stored schema metadata
3. derive tables and columns from `wasmSchema`
4. build generic queries with a string-based query builder
5. subscribe to rows with `useAll(...)`
6. mutate rows with `useDb()`

## Official data flow

In `packages/inspector/src/App.tsx`, the official inspector loads the active connection runtime by running these in parallel:

- `createJazzClient(...)`
- `fetchStoredWasmSchema(...)`
- `fetchSchemaHashes(...)`
- `fetchStoredPermissions(...)`

It then provides that runtime through app-local contexts.

Important detail: the schema and permissions are fetched once per selected connection context, while table row data remains live through `useAll(...)` subscriptions.

## How table data is subscribed

The main data explorer logic lives in `packages/inspector/src/components/data-explorer/TableDataGrid.tsx`.

The official inspector subscribes to rows by:

1. building a generic `QueryBuilder`
2. passing it to `useAll<DynamicTableRow>(queryBuilder, queryOptions)`
3. rendering the returned live rows

The generic builder is implemented in:

- `packages/inspector/src/utility/generic-query-builder.ts`

It supports:

- `where(...)`
- `orderBy(...)`
- `limit(...)`
- `offset(...)`

This is the missing core pattern for our own inspector workspace.

## How filters sorting and paging are modeled

The official inspector keeps query state outside the grid widget itself.

It derives query state from route search params:

- `filters`
- `sort`
- `dir`
- `page`
- `pageSize`

Then it builds the query like this:

1. start with `new GenericQueryBuilder(table, schema)`
2. apply each filter through `.where(...)`
3. apply sorting through `.orderBy(...)`
4. apply pagination through `.limit(...)` and `.offset(...)`

It requests `pageSize + 1` rows to infer whether a next page exists.

## How relations are resolved

If a column has `references`, the official inspector treats it as a relation field.

For relation cells it:

1. detects the referenced table from schema metadata
2. runs a secondary query for the related row by `id`
3. uses a heuristic to display a friendly label column such as `name`, `title`, or `label`
4. falls back to the raw id if no display-friendly field exists
5. links to the referenced table with a prebuilt `id = ...` filter

This logic is in `RelationCell` inside `TableDataGrid.tsx` and `relation-navigation.ts`.

## How mutations work

The official inspector uses `useDb()` for mutations.

It does not need generated app-specific table builders. Instead it creates a generic `TableProxy` shape and calls:

- `db.insert(tableProxy, updates).wait(...)`
- `db.update(tableProxy, rowId, updates).wait(...)`
- `db.delete(tableProxy, rowId).wait(...)`

Mutation parsing is schema-driven and centralized in:

- `components/data-explorer/row-mutation-form.ts`

That file handles:

- booleans
- integers and doubles
- timestamps
- enums
- json
- arrays
- row/object values
- read-only binary fields

## How schema metadata drives the UI

The official inspector uses `wasmSchema` as the single metadata source for:

- the table list
- grid column definitions
- schema view
- filter builder options
- relation detection
- mutation form generation

This means the UI is generic and not tied to generated table-specific code.

## What we should reuse conceptually

For the Regarde inspector we should keep these ideas:

1. `useInspectorRuntime` bootstraps Jazz client + schema metadata
2. a generic query builder powers all table data subscriptions
3. `useAll(...)` is the live table data source
4. `useDb()` is the mutation layer
5. `wasmSchema` drives table list, columns, filters, schema view, and mutation forms
6. relation fields are enriched progressively from schema metadata

## What we should not copy as-is

The official inspector mixes too much UI and logic in single files, especially `TableDataGrid.tsx`.

That is not a good fit for the Regarde architecture.

Reasons:

- our route shape is different
- our shell composition is different
- our design system is different
- we want reusable UI atoms in `packages/ui`
- we want feature logic in `apps/web-inspector`

The official inspector context files are also app-specific rather than reusable primitives.

## Recommendation for Regarde inspector

### Context files

Do not import the official `packages/inspector/src/contexts/*` files.

Do not copy/paste them verbatim either.

Instead:

- keep our own `InspectorProvider`
- keep our own route-aware state model
- keep our own connection, branch, schema, and table selection logic
- adapt only the ideas, not the file boundaries

The Jazz inspector contexts are tightly coupled to their own runtime modes and routing assumptions.

### Utilities

For utilities, the answer is split:

- `jazz-tools` primitives should be imported directly
- the official inspector's app-local utilities should usually be reimplemented or adapted locally

Most useful candidates to adapt into our codebase:

- generic query builder
- where-operator mapping
- filter value parsing
- mutation value parsing
- relation-navigation helpers

These should live in our own boundaries, likely under `apps/web-inspector/src/features/...` or in a local shared package if multiple apps need them.

### UI architecture direction

Preferred split for Regarde:

1. `packages/ui`
   - reusable presentational atoms and compositions
   - example: data table, side panel, filter chips, toolbar controls
2. `apps/web-inspector`
   - schema-aware hooks and data logic
   - route state
   - Jazz query and mutation orchestration
   - assembly of UI atoms with inspector-specific behavior

That means we should extract the visual data table as a Regarde UI atom, while keeping query building, row selection, editing state, filtering, and mutation orchestration inside `web-inspector`.

### Route adaptation

Our navigation should stay aligned with the Regarde route model:

- `/conn/$connectionId/$branch/$schemaHash/tables`
- `/conn/$connectionId/$branch/$schemaHash/tables/$tableName`
- `/conn/$connectionId/$branch/$schemaHash/tables/$tableName/edit`

Search params can still hold transient query state such as:

- `view=data|schema`
- `filters`
- `sort`
- `dir`
- `page`
- `pageSize`

This keeps route context and query state clearly separated.
