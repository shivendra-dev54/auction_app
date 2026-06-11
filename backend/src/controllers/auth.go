package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/error"
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

	resp := types.ApiResponse[types.SignUpBodyParams]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "Created User successfully!",
		Data:    body,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
