package customErrors

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

var InvalidRequestError error = errors.New("Invalid Request.")

func InvalidRequestErrorHandler(c *gin.Context) {
	resp := types.ApiResponse[*types.SignUpBodyParams]{
		Code:    402,
		Status:  false,
		Message: "Invalid Request.",
		Data:    nil,
	}
	c.JSON(
		402,
		resp,
	)
}
