package routers

import (
	"github.com/gin-gonic/gin"
	item_controller "github.com/shivendra-dev54/auction_app/backend/src/controllers/item"
)

func ItemRouter(router *gin.Engine) {
	itemRouter := router.Group("/api/item")
	itemRouter.GET("/", item_controller.GetAllItemsController)
	itemRouter.POST("/", item_controller.CreateNewItemController)

	itemRouter.PUT("/:id", item_controller.UpdateItemController)
	itemRouter.DELETE("/:id", item_controller.DeleteItemController)
}
