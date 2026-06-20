package services_item

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
)

func DeleteItemService(userId uint, itemId uint) error {
	if userId <= 0 || itemId <= 0 {
		return custom_errors.BadRequestError
	}

	db, err := db.DatabaseInitializer()
	if err != nil {
		return err
	}

	var item db_models.Item
	err = db.Where(
		&db_models.Item{ID: itemId}).Where(
		&db_models.Item{CurrOwnerID: userId}).Where(
		&db_models.Item{FirstOwnerID: userId}).First(&item).Error
	if err != nil {
		return err
	}

	res := db.Delete(&item)
	if res.Error != nil {
		return res.Error
	}

	return nil
}
