import { schema as s } from "jazz-tools";

import { app } from "./schema.js";

export default s.definePermissions(app, ({ policy }) => {
  policy.projects.managedByCreator();

  policy.columnTypeShowcase.allowRead.always();
  policy.columnTypeShowcase.allowInsert.always();
  policy.columnTypeShowcase.allowUpdate.never();
  policy.columnTypeShowcase.allowDelete.never();

  policy.todos.allowRead.always();
  policy.todos.allowInsert.always();
  policy.todos.allowUpdate.whereOld({ done: false }).whereNew({ done: false });
  policy.todos.allowDelete.where({ done: false });
});
