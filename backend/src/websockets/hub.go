package websockets

import (
	"sync"
	"time"

	"github.com/gorilla/websocket"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
)

type Client struct {
	UserID uint
	Conn   *websocket.Conn
}

type ActiveAuction struct {
	sync.RWMutex
	IsActive     bool
	StartTime    time.Time
	HostUserID   uint
	ItemID       uint
	Item         *db_models.Item
	CurrentBid   uint
	WinnerUserID uint
	Clients      map[*Client]bool
	BidsLog      []db_models.Bid
}

type Hub struct {
	Auction *ActiveAuction
}

var GlobalManager = &Hub{
	Auction: &ActiveAuction{
		Clients: make(map[*Client]bool),
	},
}

func (h *Hub) Broadcast(msg ServerResponse) {
	for client := range h.Auction.Clients {
		_ = client.Conn.WriteJSON(msg)
	}
}

func (h *Hub) SendDirect(client *Client, msg ServerResponse) {
	_ = client.Conn.WriteJSON(msg)
}
