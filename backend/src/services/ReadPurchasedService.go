package services

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/models"
	"gorm.io/gorm"
)

func ReadPurchasedService(
	userEmail string,
	fetchedItems *[]models.Item,
) error {
	if userEmail == "" {
		return customErrors.UnAuthorizedError
	}

	db := db.DatabaseInitializer()
	if db == nil {
		return customErrors.DatabaseError
	}

	var user models.User
	err := db.Where("Email = ?", userEmail).First(&user).Error
	if err != nil {
		return customErrors.DatabaseError
	}

	err = db.Preload(
		"Owner",
		func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "full_name", "email")
		},
	).Preload(
		"FirstOwner",
		func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "full_name", "email")
		},
	).Where(
		"owner_id = ?",
		user.ID,
	).Where(
		"first_owner_id != ?",
		user.ID,
	).Find(&fetchedItems).Error

	if err != nil {
		return customErrors.DatabaseError
	}

	return nil
}