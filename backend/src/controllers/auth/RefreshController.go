package auth_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	auth_controllers_utils "github.com/shivendra-dev54/auction_app/backend/src/controllers/auth/utils"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func RefreshController(c *gin.Context) {
	var cookies types.CookieStore

	refresh_token, err := c.Cookie("refresh_token")
	if err != nil {
		auth_controllers_utils.CookieResetHandler(c)
		customErrors.GlobalHandler(c, err)
		return
	}

	err = services.RefreshService(refresh_token, &cookies)
	if err != nil {
		auth_controllers_utils.CookieResetHandler(c)
		customErrors.GlobalHandler(c, err)
		return
	}

	c.SetCookie(
		"access_token",
		cookies.AccessToken,
		60*60,
		"/",
		"localhost",
		true,
		true,
	)
	c.SetCookie(
		"refresh_token",
		cookies.RefreshToken,
		60*60*24*7,
		"/",
		"localhost",
		true,
		true,
	)

	resp := types.ApiResponse[*types.UserInfo]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "refreshed tokens successfully!",
		Data:    nil,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
