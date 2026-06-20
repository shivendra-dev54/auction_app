package custom_errors

import (
	"errors"

	"github.com/gin-gonic/gin"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

var NotFoundError error = errors.New("Not Found !")

func NotFoundErrorHandler(c *gin.Context) {
	status_code := 404
	resp := custom_types.ApiResponse[error]{
		Code:    status_code,
		Status:  false,
		Message: "Not Found !",
		Data:    nil,
	}
	c.JSON(
		status_code,
		resp,
	)
}
