package services

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/models"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func CreateNewItem(
	userEmail string,
	itemInfo *types.CreateItemParams,
	createdItem *types.ItemInfo,
) error {

	if itemInfo.ItemName == "" || itemInfo.Desc == "" || itemInfo.BasePrice <= 0 {
		return customErrors.InvalidDataError
	}

	db := db.DatabaseInitializer()
	if db == nil {
		return customErrors.DatabaseError
	}

	var user models.User
	err := db.Where("Email = ?", userEmail).First(&user).Error
	if err != nil {
		return customErrors.DatabaseError
	}

	newItem := models.Item{
		ItemName:     itemInfo.ItemName,
		BasePrice:    itemInfo.BasePrice,
		Desc:         itemInfo.Desc,
		IsSold:       false,
		FirstOwnerID: user.ID,
		OwnerID:      user.ID,
	}

	result := db.Create(&newItem)

	if result.Error != nil {
		return customErrors.DatabaseError
	}

	createdItem.ItemName = itemInfo.ItemName
	createdItem.BasePrice = itemInfo.BasePrice
	createdItem.Desc = itemInfo.Desc
	createdItem.IsSold = false

	return nil
}
