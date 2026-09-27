export interface InMemBid {
  userId: number;
  username: string;
  amount: number;
  createdAt: Date;
}

export interface InMemAuction {
  id: string; // string UUID or numeric string for in-memory session
  itemId: number;
  itemName: string;
  hostId: number;
  startingBid: number;
  currentBid: number;
  currentBidderId: number | null;
  startedAt: Date;
  participants: Set<number>;
  bids: InMemBid[];
}

export const activeAuctions = new Map<string, InMemAuction>();