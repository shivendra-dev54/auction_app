package routers

import (
	"github.com/gin-gonic/gin"
	purchased_controllers "github.com/shivendra-dev54/auction_app/backend/src/controllers/purchased"
)

func PurchasedRouter(router *gin.Engine) {
	purchasedRouter := router.Group("/api/purchased")
	purchasedRouter.GET("/", purchased_controllers.ReadPurchasedController)
}
