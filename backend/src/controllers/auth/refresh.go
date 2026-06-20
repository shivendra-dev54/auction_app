package controllers_auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	controllers_auth_utils "github.com/shivendra-dev54/auction_app/backend/src/controllers/auth/utils"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	services_auth "github.com/shivendra-dev54/auction_app/backend/src/services/auth"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func RefreshController(c *gin.Context) {
	refresh_token, err := c.Cookie("refresh_token")
	if err != nil {
		controllers_auth_utils.CookieResetHandler(c)
		custom_errors.GlobalHandler(c, err)
		return
	}

	cookies, err := services_auth.RefreshService(refresh_token)
	if err != nil {
		controllers_auth_utils.CookieResetHandler(c)
		custom_errors.GlobalHandler(c, err)
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

	resp := custom_types.ApiResponse[*custom_types.UserInfo]{
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
