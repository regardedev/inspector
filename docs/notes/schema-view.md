## References

`https:github.com/garden-co/jazz/packages/jazz-tools/src/runtime/schema-fetch.ts`

## Problem

- What the schema content view should look like inside the existing table explorer shell?
- What Jazz schema API exposes?

## Jazz API expose

- stored schema hashes
- one stored structural schema per hash
- current permissions head
- current permissions bundle
- schema connectivity between two hashes

## Jazz does not expose

- ERD (Entity-Relationship Diagram) metadata
- primary keys / indexes browser
- historical permission per schema version
- migration explorer/history

## Scope & Goals

Simply visualize:

- Schema
- Permissions

1. fast understanding of the table
2. readable column metadata
3. clear permission visibility
4. easy access to raw compiled data when needed

Permissions
Instead of raw JSON first, show:

- read: allowed / conditional / none / unknown
- create: allowed / conditional / none / unknown
- update: allowed / conditional / none / unknown
- delete: allowed / conditional / none / unknown
  Then keep raw JSON in an expandable debug section.
  Raw
- raw schema JSON
- raw permissions JSON

## Split

- schema/view.tsx → thin page shell
- schema/useSchemaViewModel.ts → resolve table schema, permissions, derived badges, reference summaries
- schema/schemaStructurePanel.tsx
- schema/schemaPermissionsPanel.tsx
- schema/schemaRawPanel.tsx
- maybe schema/schemaColumnList.tsx
- maybe schema/schemaTableSummary.tsx

## UX

- How to render schema and permissions in a readable, table-scoped way that matches the rest of the inspector?

Design the permissions presentation model:

- what extracted fields to show
- what status labels to use
- what raw JSON to keep hidden behind disclosure

- schema is mostly column-level
- permissions are mostly table-level operations
  - read
  - insert
  - update
  - delete

### permissions view answer:

- can I insert rows?
- can rows generally be updated?
- can rows generally be deleted?

### schema view

This is where you fully show:

- here is the table structure
- here is what can be done with rows of this table
  So schema view becomes the proper place for the richer rendering.
