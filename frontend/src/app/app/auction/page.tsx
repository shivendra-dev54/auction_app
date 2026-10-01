"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { apiRequest, AuctionHistoryEntry, formatDate, formatMoney, OngoingAuction } from "@/utils/auctionApi";
import { errorNotification } from "@/utils/toastFunctionsDarkMode";

type AuctionTab = "live" | "history";

export default function AuctionsPage() {
  const { logout } = useAuthStore();
  const [tab, setTab] = useState<AuctionTab>("live");
  const [ongoing, setOngoing] = useState<OngoingAuction[]>([]);
  const [history, setHistory] = useState<AuctionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAuctions = useCallback(async () => {
    try {
      const [live, past] = await Promise.all([
        apiRequest<OngoingAuction[]>("/api/auctions/ongoing", "GET", null, logout),
        apiRequest<AuctionHistoryEntry[]>("/api/auctions/history", "GET", null, logout),
      ]);
      setOngoing(live);
      setHistory(past);
    } catch {
      errorNotification("Couldn't load auctions.");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadAuctions(), 0);
    const interval = window.setInterval(loadAuctions, 12000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [loadAuctions]);

  return (
    <main className="workspace">
      <section className="workspace-intro">
        <div><p className="eyebrow">THE AUCTION FLOOR</p><h1>Auctions</h1><p className="intro-copy">Find a room to join or revisit the results of a finished sale.</p></div>
        <Link className="button button-primary" href="/app/items">Host an auction <span aria-hidden="true">+</span></Link>
      </section>

      <div className="tab-bar" role="tablist" aria-label="Auction views">
        <button className={`tab-button ${tab === "live" ? "tab-active" : ""}`} role="tab" aria-selected={tab === "live"} onClick={() => setTab("live")}>Live now <span>{ongoing.length}</span></button>
        <button className={`tab-button ${tab === "history" ? "tab-active" : ""}`} role="tab" aria-selected={tab === "history"} onClick={() => setTab("history")}>Past auctions <span>{history.length}</span></button>
      </div>

      {loading ? <div className="empty-state">Loading auction floor...</div> : tab === "live" ? (
        ongoing.length ? <div className="auction-card-grid">
          {ongoing.map((auction) => <Link className="live-auction-card" href={`/app/auction/${auction.auctionId}`} key={auction.auctionId}>
            <div className="live-card-top"><span className="live-indicator"><i /> LIVE</span><span className="muted-copy">{auction.participantCount} in room</span></div>
            <div className="auction-symbol auction-symbol-large" aria-hidden="true">↗</div>
            <h2>{auction.item.name}</h2>
            <p className="muted-copy">Started {formatDate(auction.startedAt)}</p>
            <div className="live-card-bottom"><div><span>Current bid</span><strong>{formatMoney(auction.currentBid)}</strong></div><span className="bid-count">{auction.totalBids} bids</span></div>
            <span className="button button-dark">Enter room <span aria-hidden="true">→</span></span>
          </Link>)}
        </div> : <div className="empty-state"><strong>It&apos;s quiet on the floor</strong><span>Live auctions will appear here as soon as someone opens a room.</span><Link className="text-link" href="/app/items">Start one from your inventory →</Link></div>
      ) : (
        history.length ? <div className="history-table">
          <div className="history-header"><span>ITEM</span><span>WINNER</span><span>FINAL BID</span><span>ENDED</span><span /></div>
          {history.map((auction) => <Link className="history-row" href={`/app/auction/${auction.id}`} key={auction.id}>
            <strong>{auction.item.name}</strong><span>@{auction.winner.username}</span><strong>{formatMoney(auction.winning_bid)}</strong><span>{formatDate(auction.ended_at)}</span><span className="row-arrow" aria-hidden="true">→</span>
          </Link>)}
        </div> : <div className="empty-state"><strong>No results to show</strong><span>Completed auctions you participated in will be saved here.</span></div>
      )}
    </main>
  );
}