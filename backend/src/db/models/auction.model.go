package db_models

import "time"

type Auction struct {
	ID           uint      `gorm:"primaryKey;column:auction_id"`
	StartTime    time.Time `gorm:"column:auction_start_time"`
	EndTime      time.Time `gorm:"column:auction_end_time"`
	HostUserID   uint      `gorm:"column:auction_host_user_id"`
	HostUser     User      `gorm:"foreignKey:HostUserID"`
	ItemID       uint      `gorm:"column:auction_item_id"`
	Item         Item      `gorm:"foreignKey:ItemID"`
	WinnerUserID uint      `gorm:"column:auction_winner_user_id"`
	WinnerUser   User      `gorm:"foreignKey:WinnerUserID"`
}
