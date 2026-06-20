package custom_types

// create
type CreateItemBodyParams struct {
	Name  string `json:"name" binding:"required"`
	Price uint   `json:"price" binding:"required"`
	Desc  string `json:"desc" binding:"required"`
}


