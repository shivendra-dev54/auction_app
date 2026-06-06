package db

import (
	"log"

	"github.com/shivendra-dev54/auction_app/backend/src/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var dbInstance *gorm.DB = nil

func DatabaseInitializer() *gorm.DB {
	if dbInstance != nil {
		return dbInstance
	}

	dsn := utils.GetDbString()

	var err error
	dbInstance, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("Failed to connect to database")
	}

	return dbInstance
}
