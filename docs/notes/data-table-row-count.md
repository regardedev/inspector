## What the Jazz inspector currently supports

Jazz inspector does not expose a `recordCount` or equivalent total row count.

It uses:

- pageIndex
- pageSize
- limit
- offset
- hasNextPage

### How it computes hasNextPage

It fetches one extra row:

- query uses limit(pageSize + 1)
- then computes hasNextPage = rows.length > pageSize
  So it is using a sentinel row pattern, not count metadata.

### Key findings from subagents

#### Behavior

- builds query with limit(pageSize + 1)
- uses offset(pageIndex \* pageSize)
- derives hasNextPage
- only knows visible page rows

#### Query builder

- serializes:
  - table
  - conditions
  - includes
  - orderBy
  - limit
  - offset
  - hops

#### Lower-level runtime / protocol

It does not include:

- count
- total
- recordCount
- count request metadata

#### Subagents also found that lower layers return:

- arrays of rows
- deltas of rows

Not:

- { rows, total }
- { data, count }
  So there is no hidden total available lower in the stack either.

## Extend Jazz API

Jazz has a query pipeline that could be extended without breaking existing APIs:

- normalized query shape
- query translation layer
- relation IR in Rust
- transport layer between runtime and client

A path would be:

1. add a new count query API
   - something like query.count() or db.count(query)
2. return a scalar or { count: number }
3. let inspector run:
   - paged rows query
   - count query
