package main

import (
	"log"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shivendra-dev54/auction_app/backend/src/config"
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	"github.com/shivendra-dev54/auction_app/backend/src/middlewares"
	"github.com/shivendra-dev54/auction_app/backend/src/routers"
)

func main() {
	err := config.EnvVariablesLoader()
	if err != nil {
		log.Fatalln("UNABLE TO LOAD ENVIROMENT VARIABLES !")
	}

	dbInstance, err := db.DatabaseInitializer()
	if err == nil {
		db.MigrationHandler(dbInstance)
	} else {
		log.Fatalln("UNABLE TO CONNECT TO DATABASE !")
	}

	PORT, _ := strconv.Atoi(config.Port)
	router := gin.Default()

	router.Use(middlewares.ErrorHandlerMiddleware())
	custom_routers.HealthRouter(router)
	custom_routers.AuthRouter(router)

	router.Use(middlewares.AuthMiddleware())
	custom_routers.ItemRouter(router)
	custom_routers.PurchasedRouter(router)
	custom_routers.SocketRouter(router)

	router.Run("localhost:" + strconv.FormatUint(uint64(PORT), 10))
}
