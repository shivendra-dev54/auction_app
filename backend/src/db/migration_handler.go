package db

import (
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	"gorm.io/gorm"
)

func MigrationHandler(db *gorm.DB) {
	db.AutoMigrate(&db_models.User{})
	db.AutoMigrate(&db_models.Item{})
	db.AutoMigrate(&db_models.Auction{})
	db.AutoMigrate(&db_models.Bid{})
}
