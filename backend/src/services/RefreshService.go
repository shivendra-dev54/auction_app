package services

import (
	"encoding/base64"
	"errors"

	"github.com/shivendra-dev54/auction_app/backend/src/db"
	"github.com/shivendra-dev54/auction_app/backend/src/models"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func RefreshService(
	refresh_token string,
	store *types.CookieStore,
) error {
	tokenBytes, err := base64.URLEncoding.DecodeString(refresh_token)
	if err != nil {
		return err
	}

	payload, err := DeCipherToken(tokenBytes)
	if err != nil {
		return err
	}

	if payload.TokenType != "refresh_token" {
		return errors.New("Invalid refresh token.")
	}

	db := db.DatabaseInitializer()

	var userFromDB models.User
	err = db.Where("Email = ?", payload.Email).First(&userFromDB).Error
	if err != nil {
		return errors.New("Invalid refresh token.")
	}

	err = GetCookieTokens(&payload.UserInfo, store)
	if err != nil {
		store.RefreshToken = ""
		store.AccessToken = ""
		return errors.New("Invalid refresh token.")
	}

	return nil
}
