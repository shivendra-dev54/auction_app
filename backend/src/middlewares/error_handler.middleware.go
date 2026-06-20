package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func ErrorHandlerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				statusCode := http.StatusInternalServerError
				resp := custom_types.ApiResponse[error]{
					Code:    statusCode,
					Status:  false,
					Message: "Something went wrong!",
					Data:    nil,
				}
				c.JSON(
					statusCode,
					resp,
				)
			}
		}()

		c.Next()
	}
}
