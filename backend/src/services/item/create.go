package services_item

import (
	"github.com/shivendra-dev54/auction_app/backend/src/db"
	db_models "github.com/shivendra-dev54/auction_app/backend/src/db/models"
	custom_errors "github.com/shivendra-dev54/auction_app/backend/src/errors"
	custom_types "github.com/shivendra-dev54/auction_app/backend/src/types"
)

func CreateItemService(
	itemInfo *custom_types.CreateItemBodyParams,
	userId uint,
) error {
	if itemInfo.Name == "" || itemInfo.Desc == "" || itemInfo.Price <= 0 {
		return custom_errors.BadRequestError
	}

	db, err := db.DatabaseInitializer()
	if err != nil {
		return custom_errors.RandomError("database error.")
	}

	var user db_models.User
	err = db.Where(&db_models.User{ID: userId}).First(&user).Error
	if err != nil {
		return custom_errors.NotFoundError
	}

	item := db_models.Item{
		Name:         itemInfo.Name,
		Price:        itemInfo.Price,
		Desc:         itemInfo.Desc,
		IsSold:       false,
		FirstOwnerID: user.ID,
		CurrOwnerID:  user.ID,
	}

	res := db.Create(&item)
	if res.Error != nil {
		return custom_errors.RandomError("Database error.")
	}

	return nil
}
