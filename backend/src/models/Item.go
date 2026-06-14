package models

type Item struct {
	ID        uint `gorm:"primaryKey"`
	ItemName  string
	BasePrice uint
	Desc      string
	IsSold    bool

	// the first owner who listed item
	FirstOwnerID uint
	FirstOwner   User `gorm:"foreignKey:FirstOwnerID"`

	// current owner id
	OwnerID uint
	Owner   User `gorm:"foreignKey:OwnerID"`
}
