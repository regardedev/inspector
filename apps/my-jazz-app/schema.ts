import { schema as s } from "jazz-tools";

const schema = {
  projects: s.table({
    name: s.string(),
  }),
  columnTypeShowcase: s.table({
    label: s.string(),
    textValue: s.string(),
    booleanValue: s.boolean(),
    integerValue: s.int(),
    floatValue: s.float(),
    timestampValue: s.timestamp(),
    enumValue: s.enum("draft", "active", "archived"),
    jsonValue: s.json(),
    stringArrayValue: s.array(s.string()),
    bytesValue: s.bytes().optional(),
    optionalTextValue: s.string().optional(),
    optionalBooleanValue: s.boolean().optional(),
    optionalEnumValue: s.enum("draft", "active", "archived").optional(),
    optionalJsonValue: s.json().optional(),
    projectId: s.ref("projects").optional(),
  }),
  todos: s.table({
    title: s.string(),
    done: s.boolean(),
    description: s.string().optional(),
    parentId: s.ref("todos").optional(),
    projectId: s.ref("projects").optional(),
  }),
};

type AppSchema = s.Schema<typeof schema>;
export const app: s.App<AppSchema> = s.defineApp(schema);

export type Todo = s.RowOf<typeof app.todos>;
export type TodoQueryBuilder = typeof app.todos;
