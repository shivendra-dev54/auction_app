package controllers_auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	services_auth "github.com/shivendra-dev54/auction_app/backend/src/services/auth"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func SignUpController(c *gin.Context) {
	var body custom_types.SignUpBodyParams
	c.ShouldBindJSON(&body)

	err := services_auth.SignUpService(&body)
	if err != nil {
		custom_errors.GlobalHandler(c, err)
		return
	}

	resp := custom_types.ApiResponse[error]{
		Code:    http.StatusAccepted,
		Status:  true,
		Message: "Created User successfully!",
		Data:    nil,
	}
	c.JSON(
		http.StatusAccepted,
		resp,
	)
}
