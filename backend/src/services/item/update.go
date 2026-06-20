package services_item

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
	"gorm.io/gorm"
)

func UpdateItemService(
	userId uint,
	itemId uint,
	updateInfo custom_types.CreateItemBodyParams,
) (
	*db_models.Item,
	error,
) {

	if updateInfo.Desc == "" && updateInfo.Name == "" && updateInfo.Price == 0 {
		return nil, custom_errors.BadRequestError
	}

	db, err := db.DatabaseInitializer()
	if err != nil {
		return nil, custom_errors.RandomError("Database error.")
	}

	var item db_models.Item
	err = db.Preload(
		"CurrOwner",
		func(db *gorm.DB) *gorm.DB {
			return db.Select("user_id", "user_full_name", "user_email")
		}).Preload(
		"FirstOwner",
		func(db *gorm.DB) *gorm.DB {
			return db.Select("user_id", "user_full_name", "user_email")
		}).Where(
		&db_models.Item{ID: itemId}).Where(
		&db_models.Item{CurrOwnerID: userId}).Where(
		&db_models.Item{FirstOwnerID: userId}).First(&item).Error
	if err != nil {
		return nil, err
	}

	if updateInfo.Name != "" {
		item.Name = updateInfo.Name
	}
	if updateInfo.Desc != "" {
		item.Desc = updateInfo.Desc
	}
	if updateInfo.Price != item.Price && updateInfo.Price != 0 {
		item.Price = updateInfo.Price
	}

	res := db.Save(&item)
	if res.Error != nil {
		return nil, res.Error
	}

	return &item, nil
}
