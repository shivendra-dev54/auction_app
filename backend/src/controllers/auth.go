package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func SignUpController(c *gin.Context) {
	resp := types.ApiResponse[int]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "damm this works",
		Data:    services.SignUpService(),
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
