package item_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func CreateNewItemController(c *gin.Context) {
	val, exists := c.Get("userMail")
	if !exists {
		customErrors.UnAuthorizedErrorHandler(c)
		return
	}

	userEmail := val.(string)

	var body types.CreateItemParams
	c.ShouldBindJSON(&body)

	var newItem types.ItemInfo
	err := services.CreateNewItem(
		userEmail,
		&body,
		&newItem,
	)
	if err != nil {
		customErrors.GlobalHandler(c, err)
		return
	}

	resp := types.ApiResponse[*types.ItemInfo]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "Created new item!",
		Data:    &newItem,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
