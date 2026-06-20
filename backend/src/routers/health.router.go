package custom_routers

import (
	"github.com/gin-gonic/gin"
	controllers_health "github.com/shivendra-dev54/auction_app/backend/src/controllers/health"
)

func HealthRouter(r *gin.Engine) {
	healthRouter := r.Group("/api/health")
	healthRouter.GET("/", controllers_health.HealthController)
}
