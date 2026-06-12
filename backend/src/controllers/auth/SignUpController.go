package auth_controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/services"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)


func SignUpController(c *gin.Context) {
	var body types.SignUpBodyParams
	c.ShouldBindJSON(&body)

	err := services.SignUpService(&body)
	if err != nil {
		customErrors.GlobalHandler(c, err)
		return
	}

	resp := types.ApiResponse[*types.UserInfo]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "Created User successfully!",
		Data:    &types.UserInfo{Fullname: body.Fullname, Email: body.Email},
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}