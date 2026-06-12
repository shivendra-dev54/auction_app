package services

import (
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(rawPass string) (string, error) {
	bytePass := []byte(rawPass)

	hashedPass, err := bcrypt.GenerateFromPassword(bytePass, bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hashedPass), nil
}

func ComparePassword(rawPass string, hashedPass string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPass), []byte(rawPass))
	return err == nil
}
