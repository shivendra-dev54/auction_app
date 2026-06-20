package db_models

type User struct {
	ID       uint   `gorm:"primaryKey;column:user_id"`
	Email    string `gorm:"column:user_email"`
	FullName string `gorm:"column:user_full_name"`
	Password string `gorm:"column:user_password"`
}
