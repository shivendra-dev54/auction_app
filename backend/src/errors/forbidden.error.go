package custom_errors

import (
	"errors"

	"github.com/gin-gonic/gin"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

var ForbiddenError error = errors.New("Forbidden !")

func ForbiddenErrorHandler(c *gin.Context) {
	status_code := 403
	resp := custom_types.ApiResponse[error]{
		Code:    status_code,
		Status:  false,
		Message: "Forbidden !",
		Data:    nil,
	}
	c.JSON(
		status_code,
		resp,
	)
}