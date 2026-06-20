package controllers_health

import (
	"net/http"

	"github.com/gin-gonic/gin"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func HealthController(c *gin.Context) {
	resp := custom_types.ApiResponse[error]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "server running",
		Data:    nil,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
