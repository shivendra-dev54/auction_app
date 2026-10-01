"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { apiRequest, AuctionHistoryEntry, formatDate, formatMoney, getWebSocketUrl, RoomBid, RoomState } from "@/utils/auctionApi";
import { errorNotification, successNotification } from "@/utils/toastFunctionsDarkMode";

type HistoryDetails = AuctionHistoryEntry & {
  host_id: number;
  bids: { id: number; amount: string; createdAt: string; bidder: { id: number; username: string } }[];
};

export default function AuctionRoomPage() {
  const params = useParams<{ id: string }>();
  const auctionId = params.id;
  const { user, logout } = useAuthStore();
  const [room, setRoom] = useState<RoomState | null>(null);
  const [bids, setBids] = useState<RoomBid[]>([]);
  const [amount, setAmount] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<{ winnerId: number; winningBid: number } | null>(null);
  const [history, setHistory] = useState<HistoryDetails | null>(null);
  const [sending, setSending] = useState(false);
  const isHistory = /^\d+$/.test(auctionId);
  const isHost = room?.hostId === user?.id;

  useEffect(() => {
    if (isHistory) {
      apiRequest<HistoryDetails>(`/api/auctions/${auctionId}`, "GET", null, logout)
        .then(setHistory)
        .catch(() => setError("This auction record isn't available to your account."));
      return;
    }

    let disposed = false;
    let connection: WebSocket | null = null;
    const connect = async () => {
      try {
        await apiRequest<unknown>("/api/auth/refresh", "POST", {}, logout);
        if (disposed) return;
        connection = new WebSocket(getWebSocketUrl(`/ws/auctions/${auctionId}`));
        socketRef.current = connection;
        connection.onopen = () => setConnected(true);
        connection.onclose = () => setConnected(false);
        connection.onerror = () => setError("Couldn't connect to this room. It may have ended or your session may have expired.");
        connection.onmessage = (event) => {
          const message = JSON.parse(String(event.data)) as { type: string; payload: Record<string, unknown> };
          if (message.type === "INIT_ROOM_STATE") {
            const nextRoom = message.payload as unknown as RoomState;
            setRoom(nextRoom);
            setBids(nextRoom.recentBids || []);
            setError("");
          } else if (message.type === "NEW_BID") {
            const bid = message.payload as unknown as RoomBid;
            setBids((current) => [...current, bid].slice(-10));
            setRoom((current) => current ? { ...current, currentBid: bid.amount, currentBidderId: bid.userId, totalBids: Number(message.payload.totalBids) } : current);
          } else if (message.type === "USER_JOINED") {
            setRoom((current) => current ? { ...current, participantsCount: Number(message.payload.participantsCount) } : current);
          } else if (message.type === "AUCTION_COMPLETED") {
            setCompleted({ winnerId: Number(message.payload.winnerId), winningBid: Number(message.payload.winningBid) });
            successNotification("Auction completed.");
          } else if (message.type === "AUCTION_CANCELLED") {
            setError(String(message.payload.reason || "The host ended this auction."));
          } else if (message.type === "ERROR") {
            errorNotification(String(message.payload.message || "The request could not be completed."));
          }
        };
      } catch {
        if (!disposed) setError("Your session expired. Sign in again to enter this room.");
      }
    };
    void connect();
    return () => {
      disposed = true;
      socketRef.current = null;
      connection?.close();
    };
  }, [auctionId, isHistory, logout]);

  const sendMessage = (message: object) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      errorNotification("You're not connected to this room.");
      return false;
    }
    socket.send(JSON.stringify(message));
    return true;
  };

  const placeBid = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bid = Number(amount);
    if (!Number.isFinite(bid) || bid <= (room?.currentBid || 0)) {
      errorNotification(`Your bid must be higher than ${formatMoney(room?.currentBid || 0)}.`);
      return;
    }
    if (sendMessage({ type: "PLACE_BID", payload: { amount: bid } })) {
      setSending(true);
      window.setTimeout(() => setSending(false), 500);
      setAmount("");
    }
  };

  const finalizeAuction = () => {
    if (window.confirm("End this auction and record the highest bidder as the winner?")) {
      sendMessage({ type: "FINALIZE_WINNER" });
    }
  };

  if (isHistory) {
    return <main className="workspace">
      <Link className="back-link" href="/app/auction">← All auctions</Link>
      {history ? <>
        <section className="workspace-intro"><div><p className="eyebrow">AUCTION RESULT · #{history.id}</p><h1>{history.item.name}</h1><p className="intro-copy">Ended {formatDate(history.ended_at)}</p></div><span className="status-label status-muted">Completed</span></section>
        <section className="result-banner"><div><span>Winning bid</span><strong>{formatMoney(history.winning_bid)}</strong></div><div><span>Winner</span><strong>@{history.winner.username}</strong></div><div><span>Starting bid</span><strong>{formatMoney(history.starting_bid)}</strong></div></section>
        <section className="content-section"><div className="section-heading"><div><p className="eyebrow">BID HISTORY</p><h2>{history.bids.length} bids</h2></div></div>{history.bids.length ? <div className="bid-list">{history.bids.map((bid) => <div className="bid-row" key={bid.id}><div className="bid-avatar">{bid.bidder.username.slice(0, 1).toUpperCase()}</div><div className="bid-person"><strong>@{bid.bidder.username}</strong><span>{formatDate(bid.createdAt)}</span></div><strong className="bid-value">{formatMoney(bid.amount)}</strong></div>)}</div> : <div className="empty-state">No recorded bids.</div>}</section>
      </> : error ? <div className="empty-state"><strong>Record unavailable</strong><span>{error}</span></div> : <div className="empty-state">Loading auction result...</div>}
    </main>;
  }

  return <main className="workspace room-workspace">
    <Link className="back-link" href="/app/auction">← All auctions</Link>
    {error && <p className="notice notice-error" role="alert">{error}</p>}
    {completed && <div className="notice notice-success">Auction finished at {formatMoney(completed.winningBid)}. <Link href="/app/auction">View auction history →</Link></div>}
    {!room ? <div className="empty-state"><span className={`connection-dot ${connected ? "is-connected" : ""}`} />{error || "Connecting to the room..."}</div> : <>
      <section className="room-heading"><div><p className="eyebrow"><span className={`connection-dot ${connected ? "is-connected" : ""}`} />{completed ? "AUCTION CLOSED" : connected ? "LIVE AUCTION ROOM" : "RECONNECTING"}</p><h1>{room.itemName}</h1><p className="intro-copy">Hosted by {isHost ? "you" : `seller #${room.hostId}`} · {room.participantsCount} {room.participantsCount === 1 ? "person" : "people"} in room</p></div><span className="room-bid-count">{room.totalBids} / {room.maxBidsLimit} bids</span></section>
      <div className="room-layout">
        <section className="room-main-panel">
          <div className="current-bid-label">CURRENT BID</div>
          <div className="current-bid-value">{formatMoney(room.currentBid)}</div>
          <p className="muted-copy">Started at {formatMoney(room.startingBid)}{room.currentBidderId ? ` · leading bidder #${room.currentBidderId}` : " · no bids yet"}</p>
          {!completed && isHost && <div className="host-controls"><p>You are hosting this auction.</p><button className="button button-danger" onClick={finalizeAuction} disabled={!room.totalBids || !connected}>Finalize winner</button></div>}
          {!completed && !isHost && <form className="place-bid-form" onSubmit={placeBid}><label htmlFor="bid-amount">Your bid</label><div className="bid-input-row"><span>$</span><input id="bid-amount" type="number" min={room.currentBid + 0.01} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder={(room.currentBid + 1).toFixed(2)} required /><button className="button button-primary" disabled={!connected || sending}>{sending ? "Sending..." : "Place bid"}</button></div><span className="field-note">Must be higher than {formatMoney(room.currentBid)}.</span></form>}
        </section>
        <section className="room-bids-panel"><div className="section-heading"><div><p className="eyebrow">LIVE FEED</p><h2>Recent bids</h2></div><span className="live-indicator"><i /> LIVE</span></div>{bids.length ? <div className="bid-list">{[...bids].reverse().map((bid, index) => <div className="bid-row" key={`${bid.userId}-${bid.createdAt}-${index}`}><div className="bid-avatar">{bid.username.slice(0, 1).toUpperCase()}</div><div className="bid-person"><strong>@{bid.username}</strong><span>{new Date(bid.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div><strong className="bid-value">{formatMoney(bid.amount)}</strong></div>)}</div> : <div className="empty-state empty-compact">No bids yet. Be the first to make a move.</div>}</section>
      </div>
    </>}
  </main>;
}