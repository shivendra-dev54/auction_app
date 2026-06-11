package main

import (
	"log"
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
	if dbInstance != nil {
		db.MigrateModels(dbInstance)
	} else {
		log.Print("\n\n\n" + "UNABLE TO CONNECT TO DATABASE !" + "\n\n\n")
	}

	router.Run("localhost:" + strconv.FormatUint(uint64(PORT), 10))
}
