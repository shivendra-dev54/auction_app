package customErrors

import (
	"github.com/gin-gonic/gin"
)

func GlobalHandler(
	c *gin.Context,
	err error,
) {
	switch err {
	case DatabaseError:
		DatabaseErrorHandler(c)
		return
	case DuplicateDataError:
		DuplicateDataErrorHandler(c)
		return
	case InvalidDataError:
		InvalidDataErrorHandler(c)
		return
	case InvalidRequestError:
		InvalidRequestErrorHandler(c)
		return
	case NotFoundError:
		NotFoundErrorHandler(c)
		return
	}
}
