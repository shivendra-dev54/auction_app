package services

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/models"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func SignInService(
	userData *types.SignInBodyParams,
	userInfo *types.UserInfo,
) error {
	Email := userData.Email
	Password := userData.Password

	if Email == "" || Password == "" {
		return customErrors.InvalidDataError
	}

	db := db.DatabaseInitializer()
	if db == nil {
		return customErrors.DatabaseError
	}

	var userFromDB models.User
	err := db.Where("Email = ?", Email).First(&userFromDB).Error
	if err != nil {
		return customErrors.DatabaseError
	}

	if isPassCorrect := ComparePassword(Password, userFromDB.Password); !isPassCorrect {
		return customErrors.InvalidDataError
	}

	userInfo.Fullname = userFromDB.FullName
	userInfo.Email = userFromDB.Email

	return nil
}
