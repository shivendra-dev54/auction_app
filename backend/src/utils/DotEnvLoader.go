package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	PORT      string
	DB_STRING string
)

func loadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Failed to load enviroment variables!")
		return
	}

	PORT = os.Getenv("PORT")
	DB_STRING = os.Getenv("DB_STRING")
}

func GetPortNumber() string {
	if PORT == "" {
		loadEnv()
	}
	return PORT
}

func GetDbString() string {
	if DB_STRING == "" {
		loadEnv()
	}
	return DB_STRING
}
