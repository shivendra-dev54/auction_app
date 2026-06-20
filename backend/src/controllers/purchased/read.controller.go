package controllers_purchased

import (
	"net/http"

	"github.com/gin-gonic/gin"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	services_purchased "github.com/shivendra-dev54/auction_app/backend/src/services/purchased"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func ReadPurchasedItemController(c *gin.Context) {
	value, exists := c.Get("userId")
	if !exists {
		custom_errors.GlobalHandler(c, custom_errors.UnauthorizedError)
		return
	}

	userId := value.(uint)

	items, err := services_purchased.ReadPurchasedItemService(userId)
	if err != nil {
		custom_errors.GlobalHandler(c, err)
		return
	}

	resp := custom_types.ApiResponse[*[]db_models.Item]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "fetched items successfully.",
		Data:    items,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
