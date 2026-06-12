package routers

import (
	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/controllers"
)

func AuthRouter(router *gin.Engine) {
	authRouter := router.Group("/auth")
	authRouter.POST("/sign_up", controllers.SignUpController)
	authRouter.POST("/sign_in", controllers.SignInController)
	authRouter.POST("/refresh", controllers.RefreshController)
	authRouter.POST("/logout", controllers.LogoutController)
}
