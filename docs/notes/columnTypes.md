I'm frustrated to see basics input or selector for fields form in most dev tool. I want a dedicated components that match each types of field.

## Reference file

- `https://github.con/garden-co/jazz/packages/jazz-tools/src/drivers/types.ts`

## Goal

Create dedicated atoms components for each column type supported by Jazz.

Steps:

1. Map types and constraints
2. Create atoms
3. Consume atoms inside `rowEditorFields.tsx`

## Column types supported by Jazz

1. Text
2. Uuid
3. Integer
4. BigInt
5. Double
6. Timestamp
7. Enum
8. Boolean
9. Json
10. Array
11. Row
12. Bytea

**Extra shape**

With extra shape:

- Json can have schema?: Record<string, unknown>
- Enum has variants: string[]
- Array has element: ColumnType
- Row has columns: ColumnDescriptor[]

## Type rendering strategy

- Text -> Input
- Uuid -> Input
- Integer -> Input
- BigInt -> Input
- Double -> Input
- Timestamp -> Input
- Enum -> Select
- Boolean -> button group with `true` / `false` / `null`
- Json -> Textarea
- Array -> Textarea
- Row -> Textarea
- Bytea -> read-only display
