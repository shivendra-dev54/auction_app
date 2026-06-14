package customErrors

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

var UnAuthorizedError error = errors.New("Data Duplication Error.")

func UnAuthorizedErrorHandler(c *gin.Context) {
	resp := types.ApiResponse[error]{
		Code:    407,
		Status:  false,
		Message: "Unauthorized.",
		Data:    nil,
	}
	c.JSON(
		407,
		resp,
	)
}
