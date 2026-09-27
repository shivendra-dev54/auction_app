import { eq } from "drizzle-orm";
import { db } from "../db";
import { auctions, auctionParticipants, bids, item } from "../db/index";
import type { InMemAuction } from "../ws/auction.store";

export const persistCompletedAuction = async (
  auctionRoom: InMemAuction,
  winnerId: number,
  winningBid: number,
) => {
  return await db.transaction(async (tx) => {
    // 1. Insert completed auction
    const [savedAuction] = await tx
      .insert(auctions)
      .values({
        item_id: auctionRoom.itemId,
        host_id: auctionRoom.hostId,
        winner_id: winnerId,
        starting_bid: String(auctionRoom.startingBid),
        winning_bid: String(winningBid),
        started_at: auctionRoom.startedAt,
        ended_at: new Date(),
      })
      .returning();

    // 2. Mark item as sold and update curr_user_id to winner
    await tx
      .update(item)
      .set({
        is_sold: true,
        curr_user_id: winnerId,
      })
      .where(eq(item.id, auctionRoom.itemId));

    // 3. Insert participants
    const participantEntries = Array.from(auctionRoom.participants).map(
      (userId) => ({
        auction_id: savedAuction!.id,
        user_id: userId,
      }),
    );

    if (participantEntries.length > 0) {
      await tx.insert(auctionParticipants).values(participantEntries);
    }

    // 4. Batch insert bids
    if (auctionRoom.bids.length > 0) {
      const bidEntries = auctionRoom.bids.map((b) => ({
        auction_id: savedAuction!.id,
        user_id: b.userId,
        amount: String(b.amount),
        created_at: b.createdAt,
      }));

      await tx.insert(bids).values(bidEntries);
    }

    return savedAuction!.id;
  });
};