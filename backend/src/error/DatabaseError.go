package customErrors

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

var DatabaseError error = errors.New("Database Error.")

func DatabaseErrorHandler(c *gin.Context) {
	resp := types.ApiResponse[*types.SignUpBodyParams]{
		Code:    405,
		Status:  false,
		Message: "Database Error.",
		Data:    nil,
	}
	c.JSON(
		405,
		resp,
	)
}
