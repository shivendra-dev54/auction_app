import { pgTable, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { auctions } from "./auction.schema";

export const bids = pgTable(
  "bids",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    auction_id: integer("auction_id")
      .references(() => auctions.id, { onDelete: "cascade" })
      .notNull(),
    user_id: integer("user_id")
      .references(() => users.id)
      .notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    created_at: timestamp("created_at").notNull(),
  },
  (table) => [index("bid_auction_idx").on(table.auction_id)],
);