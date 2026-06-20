package services_item

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	"gorm.io/gorm"
)

func ReadItemService(userId uint) (*[]db_models.Item, error) {

	db, err := db.DatabaseInitializer()
	if err != nil {
		return nil, err
	}

	var items []db_models.Item
	err = db.Preload(
		"CurrOwner",
		func(db *gorm.DB) *gorm.DB {
			return db.Select("user_id", "user_full_name", "user_email")
		}).Preload(
		"FirstOwner",
		func(db *gorm.DB) *gorm.DB {
			return db.Select("user_id", "user_full_name", "user_email")
		}).Where(
		&db_models.Item{
			FirstOwnerID: userId,
		}).Where(
		&db_models.Item{
			CurrOwnerID: userId,
		}).Find(&items).Error

	return &items, nil
}
