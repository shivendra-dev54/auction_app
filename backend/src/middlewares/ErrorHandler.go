package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func ErrorHandlerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				resp := types.ApiResponse[*types.SignUpBodyParams]{
					Code:    http.StatusBadRequest,
					Status:  true,
					Message: "Something went wrong!",
					Data:    nil,
				}
				c.JSON(
					http.StatusBadRequest,
					resp,
				)
			}
		}()

		c.Next()
	}
}
