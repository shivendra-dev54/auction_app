package routers

import (
	"github.com/gin-gonic/gin"
	auth_c "github.com/shivendra-dev54/auction_app/backend/src/controllers/auth"
)

func AuthRouter(router *gin.Engine) {
	authRouter := router.Group("/auth")
	authRouter.POST("/sign_up", auth_c.SignUpController)
	authRouter.POST("/sign_in", auth_c.SignInController)
	authRouter.POST("/refresh", auth_c.RefreshController)
	authRouter.POST("/logout", auth_c.LogoutController)
}
