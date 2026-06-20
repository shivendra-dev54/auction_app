package controllers_item

import (
	"net/http"

	"github.com/gin-gonic/gin"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	services_item "github.com/shivendra-dev54/auction_app/backend/src/services/item"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func CreateItemController(c *gin.Context) {
	var body custom_types.CreateItemBodyParams
	c.ShouldBindJSON(&body)

	value, exists := c.Get("userId")
	if !exists {
		custom_errors.GlobalHandler(c, custom_errors.UnauthorizedError)
		return
	}

	userId := value.(uint)

	err := services_item.CreateItemService(&body, userId)
	if err != nil {
		custom_errors.GlobalHandler(c, err)
		return
	}

	resp := custom_types.ApiResponse[error]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "created item successfully.",
		Data:    nil,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
