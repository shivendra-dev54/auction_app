package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

// sign up
func SignUpController(c *gin.Context) {
	var body types.SignUpBodyParams
	c.ShouldBindJSON(&body)

	err := services.SignUpService(&body)
	if err != nil {
		customErrors.GlobalHandler(c, err)
		return
	}

	resp := types.ApiResponse[*types.UserInfo]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "Created User successfully!",
		Data:    &types.UserInfo{Fullname: body.Fullname, Email: body.Email},
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}

// sign in
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
		cookies.AccessToken,
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
