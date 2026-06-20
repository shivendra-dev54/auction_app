package services_auth

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"

	"github.com/shivendra-dev54/auction_app/backend/src/config"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

type payload struct {
	custom_types.UserInfo
	TokenType string
}

func GetCookieTokens(userInfo *custom_types.UserInfo, cookieStore *custom_types.CookieStore) error {
	accessTokenPayload := payload{
		UserInfo:  *userInfo,
		TokenType: "access_token",
	}
	refreshTokenPayload := payload{
		UserInfo:  *userInfo,
		TokenType: "refresh_token",
	}

	access_token, err := generateToken(&accessTokenPayload)
	if err != nil {
		return err
	}
	refresh_token, err := generateToken(&refreshTokenPayload)
	if err != nil {
		return err
	}

	cookieStore.AccessToken = base64.URLEncoding.EncodeToString(access_token)
	cookieStore.RefreshToken = base64.URLEncoding.EncodeToString(refresh_token)

	return nil
}

func generateToken(payload *payload) ([]byte, error) {
	plainText, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	block, err := aes.NewCipher([]byte(config.CookieSecret))
	if err != nil {
		return nil, err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nounce := make([]byte, aesGCM.NonceSize())
	_, err = io.ReadFull(rand.Reader, nounce)
	if err != nil {
		return nil, err
	}

	cipherText := aesGCM.Seal(nounce, nounce, plainText, nil)
	return cipherText, nil
}

func DeCipherToken(token []byte) (*payload, error) {
	block, err := aes.NewCipher([]byte(config.CookieSecret))
	if err != nil {
		return nil, err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nounceSize := aesGCM.NonceSize()
	if len(token) <= nounceSize {
		return nil, errors.New("Invalid token data.")
	}

	nounce, actualCipherText := token[:nounceSize], token[nounceSize:]

	plainText, err := aesGCM.Open(nil, nounce, actualCipherText, nil)
	if err != nil {
		return nil, err
	}

	var payload payload
	if err := json.Unmarshal(plainText, &payload); err != nil {
		return nil, err
	}

	return &payload, nil
}
