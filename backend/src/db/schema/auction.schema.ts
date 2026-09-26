import { pgTable, boolean, integer, type AnyPgColumn, json } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { item } from "./item.schema";

export const auction = pgTable('auctions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  item_id: integer('item_id').references((): AnyPgColumn => item.id),
  bids: json("bids"),
  winner_id: integer('winner_id').references((): AnyPgColumn => users.id),
  is_sold: boolean('is_sold'),
});