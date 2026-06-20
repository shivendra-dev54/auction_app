package websockets

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func SocketHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("UNABLE TO UPGRADE CONNECTION TO SOCKET !!!")
		return
	}

	defer conn.Close()

	for {
		msgType, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("CONNECTION CLOSED OR ERROR !!!")
			log.Println("ERROR: ", err)
			return
		}

		log.Println("Received message: ", msg)

		err = conn.WriteMessage(msgType, []byte("server received: " + string(msg)))
		if err != nil {
			log.Println("ERROR WHILE TRANSMITING MESSAGE: ", err)
			break
		}
	}

}
