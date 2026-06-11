package customErrors

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

var DuplicateDataError error = errors.New("Data Duplication Error.")

func DuplicateDataErrorHandler(c *gin.Context) {
	resp := types.ApiResponse[*types.SignUpBodyParams]{
		Code:    403,
		Status:  false,
		Message: "Data Duplication Error.",
		Data:    nil,
	}
	c.JSON(
		403,
		resp,
	)
}
