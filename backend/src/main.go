package main

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	"github.com/shivendra-dev54/auction_app/backend/src/middlewares"
	subRouters "github.com/shivendra-dev54/auction_app/backend/src/routers"
	"github.com/shivendra-dev54/auction_app/backend/src/utils"
)

func main() {
	PORT, _ := strconv.Atoi(utils.GetPortNumber())
	router := gin.Default()

	router.Use(middlewares.ErrorHandlerMiddleware())

	subRouters.AuthRouter(router)

	dbInstance := db.DatabaseInitializer()
	db.MigrateModels(dbInstance)

	router.Run("localhost:" + strconv.FormatUint(uint64(PORT), 10))
}
