"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { apiRequest, AuctionItem, formatMoney, OngoingAuction, userGreeting } from "@/utils/auctionApi";

export default function AppPage() {
  const { user, logout } = useAuthStore();
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [auctions, setAuctions] = useState<OngoingAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest<AuctionItem[]>("/api/items", "GET", null, logout),
      apiRequest<OngoingAuction[]>("/api/auctions/ongoing", "GET", null, logout),
    ]).then(([allItems, liveAuctions]) => {
      if (!active) return;
      setItems(allItems.filter((item) => item.user_id === user?.id));
      setAuctions(liveAuctions);
    }).catch(() => {
      if (active) setError("We couldn't load your workspace. Check your connection and try again.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [logout, user?.id]);

  return (
    <main className="workspace">
      <section className="workspace-intro">
        <div>
          <p className="eyebrow">YOUR AUCTION DESK</p>
          <h1>Good to see you, {userGreeting(user)}.</h1>
          <p className="intro-copy">Your inventory, live rooms, and recent activity in one place.</p>
        </div>
        <Link className="button button-primary" href="/app/items">Add an item <span aria-hidden="true">+</span></Link>
      </section>

      {error && <p className="notice notice-error" role="alert">{error}</p>}

      <section className="stat-grid" aria-label="Workspace overview">
        <article className="stat-block">
          <span className="stat-label">Available inventory</span>
          <strong>{loading ? "—" : items.filter((item) => !item.is_sold).length}</strong>
          <span className="stat-note">Items ready to list</span>
        </article>
        <article className="stat-block stat-accent">
          <span className="stat-label">Live auctions</span>
          <strong>{loading ? "—" : auctions.length}</strong>
          <span className="stat-note">Rooms open right now</span>
        </article>
        <article className="stat-block">
          <span className="stat-label">Completed sales</span>
          <strong>{loading ? "—" : items.filter((item) => item.is_sold).length}</strong>
          <span className="stat-note">From your inventory</span>
        </article>
      </section>

      <section className="content-section">
        <div className="section-heading">
          <div><p className="eyebrow">HAPPENING NOW</p><h2>Live auctions</h2></div>
          <Link className="text-link" href="/app/auction">Browse all <span aria-hidden="true">→</span></Link>
        </div>
        {loading ? <div className="empty-state">Loading live rooms...</div> : auctions.length ? (
          <div className="auction-list">
            {auctions.slice(0, 4).map((auction) => (
              <Link className="auction-row" href={`/app/auction/${auction.auctionId}`} key={auction.auctionId}>
                <div className="auction-symbol" aria-hidden="true">↗</div>
                <div className="auction-row-title"><strong>{auction.item.name}</strong><span>{auction.totalBids} bids · {auction.participantCount} watching</span></div>
                <div className="auction-row-price"><span>Current bid</span><strong>{formatMoney(auction.currentBid)}</strong></div>
                <span className="row-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-state"><strong>No live rooms yet</strong><span>Start an auction from any item in your inventory.</span><Link className="text-link" href="/app/items">Go to inventory →</Link></div>
        )}
      </section>

      <section className="content-section inventory-preview">
        <div className="section-heading">
          <div><p className="eyebrow">YOUR COLLECTION</p><h2>Recent inventory</h2></div>
          <Link className="text-link" href="/app/items">Manage items <span aria-hidden="true">→</span></Link>
        </div>
        {loading ? <div className="empty-state">Loading inventory...</div> : items.length ? (
          <div className="item-list">
            {items.slice(0, 4).map((item) => (
              <div className="item-row" key={item.id}>
                <div className="item-mark" aria-hidden="true">{item.itemname.slice(0, 1).toUpperCase()}</div>
                <strong>{item.itemname}</strong>
                <span className={`status-label ${item.is_sold ? "status-muted" : ""}`}>{item.is_sold ? "Sold" : "Available"}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><strong>Your collection starts here</strong><span>Add an item to host your first auction.</span><Link className="text-link" href="/app/items">Add inventory →</Link></div>
        )}
      </section>
    </main>
  );
}