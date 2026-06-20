package controllers_auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	controllers_auth_utils "github.com/shivendra-dev54/auction_app/backend/src/controllers/auth/utils"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func LogoutController(c *gin.Context) {
	controllers_auth_utils.CookieResetHandler(c)

	resp := custom_types.ApiResponse[error]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "logged out successfully!",
		Data:    nil,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
