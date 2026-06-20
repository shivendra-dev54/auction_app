package custom_routers

import (
	"github.com/gin-gonic/gin"
	controllers_auth "github.com/shivendra-dev54/auction_app/backend/src/controllers/auth"
)

func AuthRouter(r *gin.Engine) {
	authRouter := r.Group("/api/auth")
	authRouter.POST("/sign_up", controllers_auth.SignUpController)
	authRouter.POST("/sign_in", controllers_auth.SignInController)
	authRouter.POST("/refresh", controllers_auth.RefreshController)
	authRouter.POST("/logout", controllers_auth.LogoutController)
}
