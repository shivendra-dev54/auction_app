package custom_errors

import (
	"errors"

	"github.com/gin-gonic/gin"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

var UnauthorizedError error = errors.New("Bad Request !")

func UnauthorizedErrorHandler(c *gin.Context) {
	status_code := 401
	resp := custom_types.ApiResponse[error]{
		Code:    status_code,
		Status:  false,
		Message: "Unauthorized !",
		Data:    nil,
	}
	c.JSON(
		status_code,
		resp,
	)
}
