package item_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func DeleteItemController(c *gin.Context) {
	val, exists := c.Get("userMail")
	if !exists {
		customErrors.UnAuthorizedErrorHandler(c)
		return
	}

	userEmail := val.(string)
	id := c.Param("id")

	err := services.DeleteItemService(userEmail, id)
	if err != nil {
		customErrors.GlobalHandler(c, err)
		return
	}

	resp := types.ApiResponse[error]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "Delete item!",
		Data:    nil,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
