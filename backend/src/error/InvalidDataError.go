package customErrors

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

var InvalidDataError error = errors.New("Invalid Data.")

func InvalidDataErrorHandler(c *gin.Context) {
	resp := types.ApiResponse[*types.SignUpBodyParams]{
		Code:    401,
		Status:  false,
		Message: "Invalid Data.",
		Data:    nil,
	}
	c.JSON(
		401,
		resp,
	)
}
