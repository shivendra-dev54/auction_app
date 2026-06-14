package types

type ItemInfo struct {
	ItemName  string `json:"item_name" binding:"required"`
	BasePrice uint   `json:"base_price" binding:"required"`
	Desc      string `json:"desc" binding:"required"`
	IsSold    bool   `json:"is_sold" binding:"required"`
}
