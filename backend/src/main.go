package main

import (
	"strconv"

	"github.com/gin-gonic/gin"
	subRouters "github.com/shivendra-dev54/auction_app/backend/src/routers"
)

func main() {
	const PORT uint64 = 64000
	router := gin.Default()

	subRouters.AuthRouter(router)

	router.Run("localhost:" + strconv.FormatUint(PORT, 10))
}
