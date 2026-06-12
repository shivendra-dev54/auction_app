package customErrors

import (
	"github.com/gin-gonic/gin"
)

func GlobalHandler(
	c *gin.Context,
	err error,
) {
	switch err {
	case InvalidDataError: // 401
		InvalidDataErrorHandler(c)
		return
	case InvalidRequestError: // 402
		InvalidRequestErrorHandler(c)
		return
	case DuplicateDataError: // 403
		DuplicateDataErrorHandler(c)
		return
	case NotFoundError: // 404
		NotFoundErrorHandler(c)
		return
	case DatabaseError: // 405
		DatabaseErrorHandler(c)
		return
	default: // 406
		UnknownErrorHandler(c, err.Error())
		return
	}
}
