package custom_errors

import (
	"errors"

	"github.com/gin-gonic/gin"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

var BadRequestError error = errors.New("Bad Request !")

func BadRequestErrorHandler(c *gin.Context) {
	statusCode := 400
	resp := custom_types.ApiResponse[error]{
		Code:    statusCode,
		Status:  false,
		Message: "Bad Request !",
		Data:    nil,
	}
	c.JSON(
		statusCode,
		resp,
	)
}
