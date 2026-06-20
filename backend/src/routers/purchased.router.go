package custom_routers

import (
	"github.com/gin-gonic/gin"
	controllers_purchased "github.com/shivendra-dev54/auction_app/backend/src/controllers/purchased"
)

func PurchasedRouter(r *gin.Engine) {
	purchasedRouter := r.Group("/api/purchased")
	purchasedRouter.GET("/", controllers_purchased.ReadPurchasedItemController)
}
