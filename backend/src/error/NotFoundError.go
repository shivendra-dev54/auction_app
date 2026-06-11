package customErrors

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

var NotFoundError error = errors.New("Not Found!")

func NotFoundErrorHandler(c *gin.Context) {
	resp := types.ApiResponse[*types.SignUpBodyParams]{
		Code:    404,
		Status:  false,
		Message: "Not Found!",
		Data:    nil,
	}
	c.JSON(
		404,
		resp,
	)
}
