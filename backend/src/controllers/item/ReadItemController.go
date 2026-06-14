package item_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/models"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func GetAllItemsController(c *gin.Context) {
	val, exists := c.Get("userMail")
	if !exists {
		customErrors.UnAuthorizedErrorHandler(c)
		return
	}

	userEmail := val.(string)

	var fetchedItems []models.Item
	err := services.GetAllItems(userEmail, &fetchedItems)
	if err != nil {
		customErrors.GlobalHandler(c, err)
		return
	}

	resp := types.ApiResponse[*[]models.Item]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "Fetched all items.",
		Data:    &fetchedItems,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
