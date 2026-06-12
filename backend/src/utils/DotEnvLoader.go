package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	port          string
	db_string     string
	cookie_secret string
)

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Failed to load enviroment variables!")
		return
	}

	port = os.Getenv("PORT")
	db_string = os.Getenv("DB_STRING")
	cookie_secret = os.Getenv("COOKIE_SECRET")
}

func GetPortNumber() string {
	if port == "" {
		loadEnv()
	}
	return port
}

func GetDbString() string {
	if db_string == "" {
		loadEnv()
	}
	return db_string
}

func GetCookieSecret() string {
	if cookie_secret == "" {
		loadEnv()
	}
	return cookie_secret
}
