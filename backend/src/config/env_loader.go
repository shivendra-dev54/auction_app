package config

import (
	"os"

	"github.com/joho/godotenv"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
)

var (
	DatabaseString string
	Port           string
	CookieSecret   string
)

func EnvVariablesLoader() error {
	err := godotenv.Load()
	if err != nil {
		return custom_errors.RandomError("Unable to read enviroment variables!")
	}

	DatabaseString = os.Getenv("DATABASE_STRING")
	Port = os.Getenv("PORT")
	CookieSecret = os.Getenv("COOKIE_SECRET")

	if DatabaseString == "" || Port == "" || CookieSecret == "" {
		return custom_errors.RandomError("Unable to read enviroment variables!")
	}

	return nil
}
