import type { Method } from "axios";
import { axiosRequestHandler } from "@/utils/axiosRequestHandler";
import type { IUser } from "@/store/authStore";

export interface AuctionItem {
  id: number;
  itemname: string;
  user_id: number;
  curr_user_id: number | null;
  is_sold: boolean;
}

export interface OngoingAuction {
  auctionId: string;
  item: { id: number; name: string };
  hostId: number;
  startingBid: number;
  currentBid: number;
  totalBids: number;
  participantCount: number;
  startedAt: string;
}

export interface AuctionHistoryEntry {
  id: number;
  starting_bid: string;
  winning_bid: string;
  started_at: string;
  ended_at: string;
  item: { id: number; name: string };
  winner: { id: number; username: string };
}

export interface RoomBid {
  userId: number;
  username: string;
  amount: number;
  createdAt: string;
}

export interface RoomState {
  auctionId: string;
  itemId: number;
  itemName: string;
  hostId: number;
  startingBid: number;
  currentBid: number;
  currentBidderId: number | null;
  totalBids: number;
  maxBidsLimit: number;
  participantsCount: number;
  recentBids: RoomBid[];
}

export async function apiRequest<T>(
  url: string,
  method: Method,
  body: unknown,
  logout: () => void,
): Promise<T> {
  const response = await axiosRequestHandler(url, method, body, logout);
  return response.data.data as T;
}

export function getWebSocketUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || process.env.BASE_URL || "http://localhost:64000";
  const url = new URL(path, base);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  return url.toString();
}

export function formatMoney(value: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function userGreeting(user: IUser | null) {
  return user?.username || "there";
}