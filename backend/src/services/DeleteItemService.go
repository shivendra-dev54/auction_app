package services

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/models"
)

func DeleteItemService(
	userEmail string,
	itemId string,
) error {

	if userEmail == "" || itemId == "" {
		return customErrors.InvalidDataError
	}

	db := db.DatabaseInitializer()
	if db == nil {
		return customErrors.DatabaseError
	}

	var user models.User
	err := db.Where("Email = ?", userEmail).First(&user).Error
	if err != nil {
		return customErrors.NotFoundError
	}

	var item models.Item
	err = db.Where("id = ?", itemId).First(&item).Error
	if err != nil {
		return customErrors.NotFoundError
	}

	if item.OwnerID != user.ID {
		return customErrors.UnAuthorizedError
	}

	err = db.Delete(&item).Error
	if err != nil {
		return customErrors.DatabaseError
	}

	return nil
}
