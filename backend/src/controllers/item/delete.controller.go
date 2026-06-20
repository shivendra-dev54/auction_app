package controllers_item

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	services_item "github.com/shivendra-dev54/auction_app/backend/src/services/item"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func DeleteItemController(c *gin.Context) {
	value, exists := c.Get("userId")
	if !exists {
		custom_errors.GlobalHandler(c, custom_errors.UnauthorizedError)
		return
	}
	userId := value.(uint)

	param := c.Param("id")
	intVal, err := strconv.Atoi(param)
	if err != nil {
		custom_errors.GlobalHandler(c, custom_errors.BadRequestError)
	}
	itemId := uint(intVal)

	err = services_item.DeleteItemService(userId, itemId)
	if err != nil {
		custom_errors.GlobalHandler(c, err)
		return
	}

	resp := custom_types.ApiResponse[*error]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "deleted item successfully.",
		Data:    nil,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
