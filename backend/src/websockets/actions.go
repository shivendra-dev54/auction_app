package websockets

import (
	"time"

	"github.com/shivendra-dev54/auction_app/backend/src/db"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
)

func (h *Hub) ProcessMessage(client *Client, msg WSMessage) {
	switch msg.Action {
	case "list":
		h.handleList(client)
	case "host":
		h.handleHost(client, msg.ItemID)
	case "join":
		h.handleJoin(client)
	case "bid":
		h.handleBid(client, msg.Bid)
	case "sell":
		h.handleSell(client)
	case "end":
		h.handleEnd(client)
	default:
		h.SendDirect(client, ServerResponse{Type: "error", Message: "Unknown action"})
	}
}

func (h *Hub) handleList(client *Client) {
	h.Auction.RLock()
	defer h.Auction.RUnlock()

	if !h.Auction.IsActive {
		h.SendDirect(client, ServerResponse{Type: "info", Message: "No ongoing auction", Data: nil})
		return
	}

	h.SendDirect(client, ServerResponse{
		Type:    "info",
		Message: "Ongoing auction details",
		Data: map[string]interface{}{
			"host_id":     h.Auction.HostUserID,
			"item_id":     h.Auction.ItemID,
			"current_bid": h.Auction.CurrentBid,
		},
	})
}

func (h *Hub) handleHost(client *Client, itemID uint) {
	h.Auction.Lock()
	defer h.Auction.Unlock()

	if h.Auction.IsActive {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "An auction is already active right now."})
		return
	}

	database, err := db.DatabaseInitializer()
	if err != nil {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "Database connection failed."})
		return
	}

	var item db_models.Item
	if err := database.Where("item_id = ?", itemID).First(&item).Error; err != nil {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "Item not found."})
		return
	}

	if item.CurrOwnerID != client.UserID {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "You do not own this item."})
		return
	}

	h.Auction.IsActive = true
	h.Auction.StartTime = time.Now()
	h.Auction.HostUserID = client.UserID
	h.Auction.ItemID = itemID
	h.Auction.Item = &item
	h.Auction.CurrentBid = item.Price
	h.Auction.WinnerUserID = 0
	h.Auction.BidsLog = []db_models.Bid{}
	h.Auction.Clients[client] = true

	h.SendDirect(client, ServerResponse{Type: "info", Message: "Auction hosted successfully."})
}

func (h *Hub) handleJoin(client *Client) {
	h.Auction.Lock()
	if !h.Auction.IsActive {
		h.Auction.Unlock()
		h.SendDirect(client, ServerResponse{Type: "error", Message: "No active auction to join."})
		return
	}
	h.Auction.Clients[client] = true
	h.Auction.Unlock()

	h.Broadcast(ServerResponse{Type: "notification", Message: "A new user joined the auction!"})
}

func (h *Hub) handleBid(client *Client, amount uint) {
	h.Auction.Lock()
	defer h.Auction.Unlock()

	if !h.Auction.IsActive {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "No active auction."})
		return
	}
	if client.UserID == h.Auction.HostUserID {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "Host cannot place a bid."})
		return
	}
	if amount <= h.Auction.CurrentBid {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "Bid must be higher than current bid."})
		return
	}

	h.Auction.CurrentBid = amount
	h.Auction.WinnerUserID = client.UserID
	h.Auction.BidsLog = append(h.Auction.BidsLog, db_models.Bid{
		BidderID: client.UserID,
		Amount:   amount,
		PlacedAt: time.Now(),
	})

	h.Broadcast(ServerResponse{
		Type:    "update",
		Message: "New highest bid!",
		Data:    map[string]uint{"current_bid": amount, "highest_bidder": client.UserID},
	})
}

func (h *Hub) handleSell(client *Client) {
	h.Auction.Lock()
	defer h.Auction.Unlock()

	if !h.Auction.IsActive || h.Auction.HostUserID != client.UserID {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "Only the host can sell the item."})
		return
	}

	database, _ := db.DatabaseInitializer()

	auctionRecord := db_models.Auction{
		StartTime:    h.Auction.StartTime,
		EndTime:      time.Now(),
		HostUserID:   h.Auction.HostUserID,
		ItemID:       h.Auction.ItemID,
		WinnerUserID: h.Auction.WinnerUserID,
	}
	database.Create(&auctionRecord)

	if len(h.Auction.BidsLog) > 0 {
		for i := range h.Auction.BidsLog {
			h.Auction.BidsLog[i].AuctionID = auctionRecord.ID
		}
		database.Create(&h.Auction.BidsLog)
	}

	if h.Auction.WinnerUserID != 0 {
		database.Model(&db_models.Item{}).Where("item_id = ?", h.Auction.ItemID).Updates(map[string]interface{}{
			"item_is_sold":       true,
			"item_price":         h.Auction.CurrentBid,
			"item_curr_owner_id": h.Auction.WinnerUserID,
		})
	}

	h.Broadcast(ServerResponse{Type: "notification", Message: "Item sold! Auction closed."})
	h.resetState()
}

func (h *Hub) handleEnd(client *Client) {
	h.Auction.Lock()
	defer h.Auction.Unlock()

	if !h.Auction.IsActive || h.Auction.HostUserID != client.UserID {
		h.SendDirect(client, ServerResponse{Type: "error", Message: "Only the host can end the auction."})
		return
	}

	h.Broadcast(ServerResponse{Type: "notification", Message: "Auction was ended by the host without a sale."})
	h.resetState()
}

func (h *Hub) resetState() {
	h.Auction.IsActive = false
	h.Auction.StartTime = time.Time{}
	h.Auction.HostUserID = 0
	h.Auction.ItemID = 0
	h.Auction.Item = nil
	h.Auction.CurrentBid = 0
	h.Auction.WinnerUserID = 0
	h.Auction.BidsLog = nil

	for c := range h.Auction.Clients {
		_ = c.Conn.Close()
		delete(h.Auction.Clients, c)
	}
}
