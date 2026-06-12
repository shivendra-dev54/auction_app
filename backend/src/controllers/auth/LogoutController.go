package auth_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	auth_controllers_utils "github.com/shivendra-dev54/auction_app/backend/src/controllers/auth/utils"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func LogoutController(c *gin.Context) {
	auth_controllers_utils.CookieResetHandler(c)

	resp := types.ApiResponse[*types.UserInfo]{
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
