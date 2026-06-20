package services_auth

import (
	"encoding/base64"
	"log"

	"github.com/shivendra-dev54/auction_app/backend/src/db"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func RefreshService(
	refresh_token string,
) (*custom_types.CookieStore, error) {
	if refresh_token == "" {
		log.Print("REFRESH TOKEN EMPTY!!!")
		return nil, custom_errors.BadRequestError
	}

	tokenBytes, err := base64.URLEncoding.DecodeString(refresh_token)
	if err != nil {
		return nil, err
	}

	userDataPayload, err := DeCipherToken(tokenBytes)
	if err != nil {
		log.Print("DECIPHER ERROR !!!")
		return nil, custom_errors.BadRequestError
	}

	db, err := db.DatabaseInitializer()
	if err != nil {
		return nil, custom_errors.RandomError("Database error.")
	}

	var userFromDB db_models.User
	err = db.Where(&db_models.User{Email: userDataPayload.Email}).First(&userFromDB).Error
	if err != nil {
		return nil, custom_errors.RandomError("Database error.")
	}

	var cookies custom_types.CookieStore

	err = GetCookieTokens(&userDataPayload.UserInfo, &cookies)
	if err != nil {
		return nil, err
	}

	return &cookies, nil
}
