"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { apiRequest, AuctionItem, formatMoney, OngoingAuction } from "@/utils/auctionApi";
import { errorNotification, successNotification } from "@/utils/toastFunctionsDarkMode";

export default function ItemsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [auctions, setAuctions] = useState<OngoingAuction[]>([]);
  const [itemName, setItemName] = useState("");
  const [startingBids, setStartingBids] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | "new" | null>(null);

  const loadItems = useCallback(async () => {
    const [allItems, ongoing] = await Promise.all([
      apiRequest<AuctionItem[]>("/api/items", "GET", null, logout),
      apiRequest<OngoingAuction[]>("/api/auctions/ongoing", "GET", null, logout),
    ]);
    setItems(allItems.filter((item) => item.user_id === user?.id));
    setAuctions(ongoing);
  }, [logout, user?.id]);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadItems().catch(() => errorNotification("Couldn't load inventory.")).finally(() => setLoading(false));
    }, 0);
    return () => window.clearTimeout(initialLoad);
  }, [loadItems]);

  const createItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!itemName.trim()) return;
    setBusyId("new");
    try {
      await apiRequest<AuctionItem>("/api/items", "POST", { itemname: itemName.trim() }, logout);
      setItemName("");
      await loadItems();
      successNotification("Item added to your inventory.");
    } catch {
      errorNotification("Couldn't add this item.");
    } finally {
      setBusyId(null);
    }
  };

  const renameItem = async (item: AuctionItem) => {
    const nextName = window.prompt("Rename item", item.itemname)?.trim();
    if (!nextName || nextName === item.itemname) return;
    try {
      await apiRequest<AuctionItem>(`/api/items/${item.id}`, "PATCH", { itemname: nextName }, logout);
      await loadItems();
      successNotification("Item name updated.");
    } catch {
      errorNotification("Couldn't update this item.");
    }
  };

  const deleteItem = async (item: AuctionItem) => {
    if (!window.confirm(`Delete ${item.itemname} from your inventory?`)) return;
    try {
      await apiRequest<AuctionItem>(`/api/items/${item.id}`, "DELETE", null, logout);
      await loadItems();
      successNotification("Item removed.");
    } catch {
      errorNotification("Couldn't delete this item.");
    }
  };

  const startAuction = async (item: AuctionItem) => {
    const startingBid = Number(startingBids[item.id]);
    if (!Number.isFinite(startingBid) || startingBid <= 0) {
      errorNotification("Enter a starting bid greater than zero.");
      return;
    }
    setBusyId(item.id);
    try {
      const auction = await apiRequest<{ auctionId: string }>("/api/auctions", "POST", { itemId: item.id, startingBid }, logout);
      router.push(`/app/auction/${auction.auctionId}`);
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      errorNotification(message || "Couldn't start this auction.");
    } finally {
      setBusyId(null);
    }
  };

  const hasActiveAuction = (itemId: number) => auctions.some((auction) => auction.item.id === itemId);

  return (
    <main className="workspace">
      <section className="workspace-intro">
        <div><p className="eyebrow">SELLER TOOLS</p><h1>Your inventory</h1><p className="intro-copy">Keep your listings organized and take an item live when you&apos;re ready.</p></div>
        <span className="count-chip">{items.length} {items.length === 1 ? "item" : "items"}</span>
      </section>

      <section className="create-item-panel">
        <div><span className="eyebrow">NEW LISTING</span><h2>Add an item</h2></div>
        <form className="inline-form" onSubmit={createItem}>
          <label className="sr-only" htmlFor="item-name">Item name</label>
          <input id="item-name" value={itemName} onChange={(event) => setItemName(event.target.value)} placeholder="e.g. Vintage film camera" maxLength={120} required />
          <button className="button button-primary" type="submit" disabled={busyId === "new"}>{busyId === "new" ? "Adding..." : "Add item"}</button>
        </form>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>All items</h2></div></div>
        {loading ? <div className="empty-state">Loading inventory...</div> : items.length ? (
          <div className="inventory-grid">
            {items.map((item) => {
              const active = hasActiveAuction(item.id);
              return <article className="inventory-card" key={item.id}>
                <div className="inventory-card-top"><div className="item-mark item-mark-large" aria-hidden="true">{item.itemname.slice(0, 1).toUpperCase()}</div><span className={`status-label ${item.is_sold ? "status-muted" : active ? "status-live" : ""}`}>{item.is_sold ? "Sold" : active ? "Live" : "Available"}</span></div>
                <h3>{item.itemname}</h3>
                <p className="muted-copy">Inventory ID · {item.id}</p>
                {!item.is_sold && !active && <div className="start-auction-form">
                  <label htmlFor={`starting-bid-${item.id}`}>Starting bid</label>
                  <div className="bid-input-row"><span>$</span><input id={`starting-bid-${item.id}`} type="number" min="0.01" step="0.01" placeholder="0.00" value={startingBids[item.id] || ""} onChange={(event) => setStartingBids((current) => ({ ...current, [item.id]: event.target.value }))} /><button className="button button-primary button-compact" onClick={() => startAuction(item)} disabled={busyId === item.id}>{busyId === item.id ? "Starting..." : "Go live"}</button></div>
                </div>}
                {active && <p className="muted-copy">Live at {formatMoney(auctions.find((auction) => auction.item.id === item.id)?.currentBid || 0)}</p>}
                <div className="card-actions"><button className="text-button" onClick={() => renameItem(item)} disabled={item.is_sold || active}>Rename</button><button className="text-button text-danger" onClick={() => deleteItem(item)} disabled={active}>Delete</button></div>
              </article>;
            })}
          </div>
        ) : <div className="empty-state"><strong>No inventory yet</strong><span>Add your first item above to get your auction desk moving.</span></div>}
      </section>
    </main>
  );
}