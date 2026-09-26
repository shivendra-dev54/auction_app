import { text, pgTable, boolean, integer, type AnyPgColumn } from "drizzle-orm/pg-core";
import { users } from "./user.schema";

export const item = pgTable('items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  itemname: text('name'),
  user_id: integer('user_id').references((): AnyPgColumn => users.id),
  curr_user_id: integer('curr_user_id').references((): AnyPgColumn => users.id),
  is_sold: boolean('is_sold'),
});