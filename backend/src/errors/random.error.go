package custom_errors

import (
	"errors"

	"github.com/gin-gonic/gin"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func RandomError(msg string) error {
	return errors.New(msg)
}

func RandomErrorHandler(c *gin.Context, message string) {
	status_code := 422
	resp := custom_types.ApiResponse[error]{
		Code:    status_code,
		Status:  false,
		Message: message,
		Data:    nil,
	}
	c.JSON(
		status_code,
		resp,
	)
}
