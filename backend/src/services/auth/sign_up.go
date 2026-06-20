package services_auth

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
	"gorm.io/gorm"
)

func SignUpService(
	userData *custom_types.SignUpBodyParams,
) error {

	if userData.Fullname == "" || userData.Email == "" || userData.Password == "" {
		return custom_errors.BadRequestError
	}

	db, err := db.DatabaseInitializer()
	if err != nil {
		return custom_errors.RandomError("Database error !")
	}

	var userFormDbWithSameMail db_models.User
	err = db.Where(&db_models.User{Email: userData.Email}).First(&userFormDbWithSameMail).Error
	if err != nil && err != gorm.ErrRecordNotFound {
		return custom_errors.RandomError("Database error.")
	}
	if userFormDbWithSameMail.Email != "" {
		return custom_errors.RandomError("User with this mail id exists.")
	}

	passCipher, err := HashPassword(userData.Password)
	if err != nil {
		return custom_errors.RandomError("Error while ciphering password.")
	}

	var user db_models.User = db_models.User{
		FullName: userData.Fullname,
		Email:    userData.Email,
		Password: passCipher,
	}
	db.Create(&user)

	return nil
}
