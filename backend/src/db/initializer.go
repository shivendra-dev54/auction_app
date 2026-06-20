package db

import (
	"github.com/shivendra-dev54/auction_app/backend/src/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var dbInstance *gorm.DB = nil

func DatabaseInitializer() (*gorm.DB, error) {
	if dbInstance != nil {
		return dbInstance, nil
	}

	dsn := config.DatabaseString
	var err error
	dbInstance, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		return nil, err
	}
	return dbInstance, nil
}
