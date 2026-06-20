package services_auth

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func SignInService(
	userData *custom_types.SignInBodyParams,
) (*custom_types.CookieStore, error) {
	if userData.Email == "" || userData.Password == "" {
		return nil, custom_errors.BadRequestError
	}

	db, err := db.DatabaseInitializer()
	if err != nil {
		return nil, custom_errors.RandomError("Database error.")
	}

	var userFromDB db_models.User
	err = db.Where(&db_models.User{Email: userData.Email}).First(&userFromDB).Error
	if err != nil {
		return nil, custom_errors.RandomError("Database error.")
	}

	if isPassCorrect := ComparePassword(userData.Password, userFromDB.Password); !isPassCorrect {
		return nil, custom_errors.BadRequestError
	}

	var cookies custom_types.CookieStore
	userDataPayload := custom_types.UserInfo{
		ID:       userFromDB.ID,
		FullName: userFromDB.FullName,
		Email:    userFromDB.Email,
	}

	err = GetCookieTokens(&userDataPayload, &cookies)
	if err != nil {
		return nil, err
	}

	return &cookies, nil
}
