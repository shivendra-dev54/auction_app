package middlewares

import (
	"encoding/base64"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		accessToken, err := c.Cookie("access_token")
		if err != nil {
			badAuthResponseHandler(c)
			return
		}

		byteToken, err := base64.URLEncoding.DecodeString(accessToken)
		if err != nil {
			badAuthResponseHandler(c)
			return
		}

		payload, err := services.DeCipherToken(byteToken)
		if err != nil {
			badAuthResponseHandler(c)
			return
		}

		c.Set("userMail", payload.Email)
		c.Next()
	}
}

func badAuthResponseHandler(c *gin.Context) {
	resp := types.ApiResponse[error]{
		Code:    http.StatusUnauthorized,
		Status:  false,
		Message: "Unauthorized!",
		Data:    nil,
	}
	c.AbortWithStatusJSON(
		http.StatusUnauthorized,
		resp,
	)
}
