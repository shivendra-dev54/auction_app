import { eq, and, desc, inArray } from "drizzle-orm";
import crypto from "crypto";
import { db } from "../db";
import {
  auctions,
  auctionParticipants,
  bids,
  item,
  users,
} from "../db/index";
import type { InMemAuction } from "../ws/auction.store";
import { activeAuctions } from "../ws/auction.store";
import { ApiError } from "../errors/ApiError";
import { HTTP_RESPONSE } from "../constants/response_codes";

const MAX_CONCURRENT_AUCTIONS = 2;

export const createAuction = async (
  userId: number,
  itemId: number,
  startingBid: number,
) => {
  if (activeAuctions.size >= MAX_CONCURRENT_AUCTIONS) {
    throw new ApiError(
      HTTP_RESPONSE.TOO_MANY_REQUESTS,
      "Maximum of 2 concurrent auctions are currently running. Try again later.",
    );
  }

  const [targetItem] = await db
    .select()
    .from(item)
    .where(eq(item.id, itemId))
    .limit(1);

  if (!targetItem) {
    throw new ApiError(HTTP_RESPONSE.NOT_FOUND, "Item not found");
  }

  if (targetItem.user_id !== userId) {
    throw new ApiError(
      HTTP_RESPONSE.FORBIDDEN,
      "You can only host auctions for items you own",
    );
  }

  if (targetItem.is_sold) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "This item has already been sold",
    );
  }

  for (const ongoing of activeAuctions.values()) {
    if (ongoing.itemId === itemId) {
      throw new ApiError(
        HTTP_RESPONSE.CONFLICT,
        "An ongoing auction already exists for this item",
      );
    }
  }

  const auctionId = crypto.randomUUID();

  const newAuction: InMemAuction = {
    id: auctionId,
    itemId,
    itemName: targetItem.itemname,
    hostId: userId,
    startingBid,
    currentBid: startingBid,
    currentBidderId: null,
    startedAt: new Date(),
    participants: new Set([userId]),
    bids: [],
    clients: new Map(),
  };

  activeAuctions.set(auctionId, newAuction);

  return {
    auctionId: newAuction.id,
    itemId: newAuction.itemId,
    itemName: newAuction.itemName,
    hostId: newAuction.hostId,
    startingBid: newAuction.startingBid,
    startedAt: newAuction.startedAt,
  };
};

export const getOngoingAuctions = () => {
  const ongoingList = [];

  for (const auction of activeAuctions.values()) {
    ongoingList.push({
      auctionId: auction.id,
      item: {
        id: auction.itemId,
        name: auction.itemName,
      },
      hostId: auction.hostId,
      startingBid: auction.startingBid,
      currentBid: auction.currentBid,
      totalBids: auction.bids.length,
      participantCount: auction.participants.size,
      startedAt: auction.startedAt,
    });
  }

  return ongoingList;
};

export const getAuctionHistory = async (userId: number) => {
  const userParticipations = await db
    .select({ auctionId: auctionParticipants.auction_id })
    .from(auctionParticipants)
    .where(eq(auctionParticipants.user_id, userId));

  const participatedIds = userParticipations.map((p) => p.auctionId);

  if (participatedIds.length === 0) {
    return [];
  }

  const history = await db
    .select({
      id: auctions.id,
      starting_bid: auctions.starting_bid,
      winning_bid: auctions.winning_bid,
      started_at: auctions.started_at,
      ended_at: auctions.ended_at,
      item: {
        id: item.id,
        name: item.itemname,
      },
      winner: {
        id: users.id,
        username: users.username,
      },
    })
    .from(auctions)
    .innerJoin(item, eq(auctions.item_id, item.id))
    .innerJoin(users, eq(auctions.winner_id, users.id))
    .where(inArray(auctions.id, participatedIds))
    .orderBy(desc(auctions.ended_at));

  return history;
};

export const getPastAuctionById = async (auctionId: number, userId: number) => {
  const [targetAuction] = await db
    .select({
      id: auctions.id,
      starting_bid: auctions.starting_bid,
      winning_bid: auctions.winning_bid,
      started_at: auctions.started_at,
      ended_at: auctions.ended_at,
      host_id: auctions.host_id,
      item: {
        id: item.id,
        name: item.itemname,
      },
      winner: {
        id: users.id,
        username: users.username,
      },
    })
    .from(auctions)
    .innerJoin(item, eq(auctions.item_id, item.id))
    .innerJoin(users, eq(auctions.winner_id, users.id))
    .where(eq(auctions.id, auctionId))
    .limit(1);

  if (!targetAuction) {
    throw new ApiError(HTTP_RESPONSE.NOT_FOUND, "Past auction record not found");
  }

  const [hasParticipated] = await db
    .select()
    .from(auctionParticipants)
    .where(
      and(
        eq(auctionParticipants.auction_id, auctionId),
        eq(auctionParticipants.user_id, userId),
      ),
    )
    .limit(1);

  if (!hasParticipated && targetAuction.host_id !== userId) {
    throw new ApiError(
      HTTP_RESPONSE.FORBIDDEN,
      "You were not a participant or host in this auction",
    );
  }

  const auctionBids = await db
    .select({
      id: bids.id,
      amount: bids.amount,
      createdAt: bids.created_at,
      bidder: {
        id: users.id,
        username: users.username,
      },
    })
    .from(bids)
    .innerJoin(users, eq(bids.user_id, users.id))
    .where(eq(bids.auction_id, auctionId))
    .orderBy(desc(bids.created_at));

  return {
    ...targetAuction,
    bids: auctionBids,
  };
};