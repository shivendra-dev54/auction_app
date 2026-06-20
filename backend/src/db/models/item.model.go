package db_models

type Item struct {
	ID     uint   `gorm:"primaryKey;column:item_id"`
	Name   string `gorm:"column:item_name"`
	Price  uint   `gorm:"column:item_price"`
	Desc   string `gorm:"column:item_desc"`
	IsSold bool   `gorm:"column:item_is_sold"`

	FirstOwnerID uint `gorm:"column:item_first_owner_id"`
	FirstOwner   User `gorm:"foreignKey:FirstOwnerID"`

	CurrOwnerID uint `gorm:"column:item_curr_owner_id"`
	CurrOwner   User `gorm:"foreignKey:CurrOwnerID"`
}
