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
				resp := types.ApiResponse[error]{
					Code:    http.StatusBadRequest,
					Status:  false,
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
