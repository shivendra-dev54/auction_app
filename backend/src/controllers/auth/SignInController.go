package auth_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func SignInController(c *gin.Context) {
	var body types.SignInBodyParams
	c.ShouldBindJSON(&body)

	// user auth
	var userData types.UserInfo
	err := services.SignInService(&body, &userData)
	if err != nil {
		customErrors.GlobalHandler(c, err)
		return
	}

	// cookies
	var cookies types.CookieStore
	err = services.GetCookieTokens(&userData, &cookies)
	if err != nil {
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
		Message: "signed in successfully!",
		Data:    &userData,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
