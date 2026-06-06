package models

type User struct {
	ID       uint `gorm:"primaryKey"`
	FullName string
	Email    string
	Password string
}
