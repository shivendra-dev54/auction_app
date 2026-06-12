package customErrors

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

var UnknownError error = errors.New("Something went wrong.")

func UnknownErrorHandler(c *gin.Context, msg string) {
	resp := types.ApiResponse[error]{
		Code:    406,
		Status:  false,
		Message: msg,
		Data:    nil,
	}
	c.JSON(
		406,
		resp,
	)
}
