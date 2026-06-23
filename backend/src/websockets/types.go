package websockets

type WSMessage struct {
	Action string `json:"action"` // "list", "host", "join", "bid", "sell", "end"
	ItemID uint   `json:"item_id"`
	Bid    uint   `json:"bid"`
}

type ServerResponse struct {
	Type    string      `json:"type"` // "info", "error", "notification", "update"
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}
