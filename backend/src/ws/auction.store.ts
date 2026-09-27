import type { WebSocket } from "ws";

export interface InMemBid {
  userId: number;
  username: string;
  amount: number;
  createdAt: Date;
}

export interface InMemAuction {
  id: string;
  itemId: number;
  itemName: string;
  hostId: number;
  startingBid: number;
  currentBid: number;
  currentBidderId: number | null;
  startedAt: Date;
  participants: Set<number>;
  bids: InMemBid[];
  clients: Map<number, Set<WebSocket>>; // userId -> active WebSockets
}

export const activeAuctions = new Map<string, InMemAuction>();