package controllers_auth_utils

import "github.com/gin-gonic/gin"

func CookieResetHandler(c *gin.Context) {
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
