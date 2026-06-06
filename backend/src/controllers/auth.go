package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
	"net/http"
)

func SignUpController(c *gin.Context) {

	var body types.SignUpBodyParams
	c.ShouldBindJSON(&body)

	FullName := body.Fullname
	Email := body.Email
	Password := body.Password

	if FullName == "" || Email == "" || Password == "" {
		panic("Invalid Data")
	}

	resp := types.ApiResponse[types.SignUpBodyParams]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "damm this works",
		Data:    body,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
