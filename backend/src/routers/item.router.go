package custom_routers

import (
	"github.com/gin-gonic/gin"
	controllers_item "github.com/shivendra-dev54/auction_app/backend/src/controllers/item"
)

func ItemRouter(r *gin.Engine) {
	itemRouter := r.Group("/api/item")
	itemRouter.POST("/", controllers_item.CreateItemController)
	itemRouter.GET("/", controllers_item.ReadItemController)

	itemRouter.PUT("/:id", controllers_item.UpdateItemController)
	itemRouter.DELETE("/:id", controllers_item.DeleteItemController)
}
