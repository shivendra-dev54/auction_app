package services

import (
	"errors"

	"github.com/shivendra-dev54/auction_app/backend/src/db"
	"github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/models"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
	"gorm.io/gorm"
)

func SignUpService(
	UserData *types.SignUpBodyParams,
) error {

	FullName := UserData.Fullname
	Email := UserData.Email
	Password := UserData.Password

	if FullName == "" || Email == "" || Password == "" {
		return customErrors.InvalidDataError
	}

	db := db.DatabaseInitializer()
	if db == nil {
		return customErrors.DatabaseError
	}

	var existingProduct models.User
	err := db.Where("Email = ?", Email).First(&existingProduct).Error
	
	if err == nil {
		return customErrors.DuplicateDataError
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return customErrors.DatabaseError
	}

	newUser := models.User{
		FullName: FullName,
		Email:    Email,
		Password: Password,
	}
	result := db.Create(&newUser)

	if result.Error != nil {
		return customErrors.DatabaseError
	}

	return nil
}
