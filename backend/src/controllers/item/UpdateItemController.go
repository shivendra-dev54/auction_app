package item_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func UpdateItemController(c *gin.Context) {
	val, exists := c.Get("userMail")
	if !exists {
		customErrors.UnAuthorizedErrorHandler(c)
		return
	}

	userEmail := val.(string)
	id := c.Param("id")

	var body types.CreateItemParams
	c.ShouldBindJSON(&body)

	updatedItem, err := services.UpdateItemService(userEmail, id, body)
	if err != nil {
		customErrors.GlobalHandler(c, err)
		return
	}

	resp := types.ApiResponse[*types.ItemInfo]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "Updated item!",
		Data:    &updatedItem,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
