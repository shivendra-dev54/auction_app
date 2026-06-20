package custom_routers

import (
	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/websockets"
)

func SocketRouter(r *gin.Engine) {
	socketRouter := r.Group("/api/ws")
	socketRouter.GET("/", websockets.SocketHandler)
}
