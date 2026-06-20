package middlewares

import (
	"encoding/base64"
	"net/http"

	"github.com/gin-gonic/gin"
	services_auth "github.com/shivendra-dev54/auction_app/backend/src/services/auth"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
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

		payload, err := services_auth.DeCipherToken(byteToken)
		if err != nil {
			badAuthResponseHandler(c)
			return
		}

		c.Set("userId", payload.ID)
		c.Next()
	}
}

func badAuthResponseHandler(c *gin.Context) {
	resp := custom_types.ApiResponse[error]{
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
