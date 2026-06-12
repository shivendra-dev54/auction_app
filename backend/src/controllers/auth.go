package controllers

import (
	"log"
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

func RefreshController(c *gin.Context) {
	var cookies types.CookieStore

	refresh_token, err := c.Cookie("refresh_token")
	if err != nil {
		cookieResetHandler(c)
		customErrors.GlobalHandler(c, err)
		return
	}
	
	err = services.RefreshService(refresh_token, &cookies)
	if err != nil {
		cookieResetHandler(c)
		log.Println("\n\n\n" + "this is where it happened")
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

func cookieResetHandler(
	c *gin.Context,
) {
	c.SetCookie(
		"access_token",
		"",
		1,
		"/",
		"localhost",
		true,
		true,
	)
	c.SetCookie(
		"refresh_token",
		"",
		1,
		"/",
		"localhost",
		true,
		true,
	)
}
