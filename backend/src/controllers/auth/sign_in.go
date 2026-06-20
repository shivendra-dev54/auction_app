package controllers_auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	services_auth "github.com/shivendra-dev54/auction_app/backend/src/services/auth"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func SignInController(c *gin.Context) {
	var body custom_types.SignInBodyParams
	c.ShouldBindJSON(&body)

	cookies, err := services_auth.SignInService(&body)
	if err != nil {
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

	resp := custom_types.ApiResponse[error]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "signed in successfully!",
		Data:    nil,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
