import { pgTable, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { users } from "./user.schema";
import { item } from "./item.schema";

export const auctions = pgTable("auctions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  item_id: integer("item_id")
    .references(() => item.id)
    .notNull(),
  host_id: integer("host_id")
    .references(() => users.id)
    .notNull(),
  winner_id: integer("winner_id")
    .references(() => users.id)
    .notNull(),
  starting_bid: numeric("starting_bid", { precision: 12, scale: 2 }).notNull(),
  winning_bid: numeric("winning_bid", { precision: 12, scale: 2 }).notNull(),
  started_at: timestamp("started_at").notNull(),
  ended_at: timestamp("ended_at").defaultNow().notNull(),
});

export const auctionParticipants = pgTable("auction_participants", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  auction_id: integer("auction_id")
    .references(() => auctions.id, { onDelete: "cascade" })
    .notNull(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  joined_at: timestamp("joined_at").defaultNow().notNull(),
});