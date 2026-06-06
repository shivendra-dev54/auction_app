package db

import (
	"github.com/shivendra-dev54/auction_app/backend/src/models"
	"gorm.io/gorm"
)

func MigrateModels(db *gorm.DB) {
	db.AutoMigrate(&models.User{})
}
