package controllers_item

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	services_item "github.com/shivendra-dev54/auction_app/backend/src/services/item"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func UpdateItemController(c *gin.Context) {
	var body custom_types.CreateItemBodyParams
	c.ShouldBindJSON(&body)

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

	item, err := services_item.UpdateItemService(userId, itemId, body)
	if err != nil {
		custom_errors.GlobalHandler(c, err)
		return
	}

	resp := custom_types.ApiResponse[*db_models.Item]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "updated item successfully.",
		Data:    item,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
