package routers

import (
	"github.com/gin-gonic/gin"
	item_controller "github.com/shivendra-dev54/auction_app/backend/src/controllers/item"
	"github.com/shivendra-dev54/auction_app/backend/src/middlewares"
)

func ItemRouter(router *gin.Engine) {
	itemRouter := router.Group("/api/item")
	router.Use(middlewares.AuthMiddleware())
	itemRouter.GET("/", item_controller.GetAllItemsController)
	itemRouter.POST("/", item_controller.CreateNewItemController)
}
