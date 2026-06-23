package websockets

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func SocketHandler(c *gin.Context) {
	value, exists := c.Get("userId")
	if !exists {
		custom_errors.GlobalHandler(c, custom_errors.UnauthorizedError)
		return
	}
	userId := value.(uint)

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("UNABLE TO UPGRADE CONNECTION TO SOCKET !!!")
		return
	}
	defer conn.Close()

	client := &Client{
		UserID: userId,
		Conn:   conn,
	}

	for {
		var msg WSMessage

		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println("CONNECTION CLOSED OR ERROR !!!")
			log.Println("ERROR: ", err)

			GlobalManager.Auction.Lock()
			if _, ok := GlobalManager.Auction.Clients[client]; ok {
				delete(GlobalManager.Auction.Clients, client)
			}
			GlobalManager.Auction.Unlock()
			break
		}
		GlobalManager.ProcessMessage(client, msg)
	}
}
