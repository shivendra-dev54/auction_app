package services

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	customErrors "github.com/shivendra-dev54/auction_app/backend/src/error"
	"github.com/shivendra-dev54/auction_app/backend/src/models"
	"github.com/shivendra-dev54/auction_app/backend/src/types"
)

func UpdateItemService(
	userEmail string,
	itemId string,
	itemInfo types.CreateItemParams,
) (types.ItemInfo, error) {

	if userEmail == "" || itemId == "" || (itemInfo.ItemName == "" && itemInfo.BasePrice == 0 && itemInfo.Desc == "") {
		return types.ItemInfo{}, customErrors.InvalidDataError
	}

	db := db.DatabaseInitializer()
	if db == nil {
		return types.ItemInfo{}, customErrors.DatabaseError
	}

	var user models.User
	err := db.Where("Email = ?", userEmail).First(&user).Error
	if err != nil {
		return types.ItemInfo{}, customErrors.NotFoundError
	}

	var item models.Item
	err = db.Where("id = ?", itemId).First(&item).Error
	if err != nil {
		return types.ItemInfo{}, customErrors.NotFoundError
	}

	if item.OwnerID != user.ID {
		return types.ItemInfo{}, customErrors.UnAuthorizedError
	}

	if itemInfo.ItemName != "" {
		item.ItemName = itemInfo.ItemName
	}
	if itemInfo.BasePrice > 0 {
		item.BasePrice = itemInfo.BasePrice
	}
	if itemInfo.Desc != "" {
		item.Desc = itemInfo.Desc
	}

	err = db.Save(&item).Error
	if err != nil {
		return types.ItemInfo{}, customErrors.DatabaseError
	}

	return types.ItemInfo{
		ItemName:  item.ItemName,
		BasePrice: item.BasePrice,
		Desc:      item.Desc,
	}, nil
}
