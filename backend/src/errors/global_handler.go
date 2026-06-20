package custom_errors

import "github.com/gin-gonic/gin"

func GlobalHandler(c *gin.Context, err error) {
	switch err {
	case BadRequestError:
		BadRequestErrorHandler(c)
		return
	case UnauthorizedError:
		UnauthorizedErrorHandler(c)
		return
	case ForbiddenError:
		ForbiddenErrorHandler(c)
		return
	case NotFoundError:
		NotFoundErrorHandler(c)
		return
	default:
		RandomErrorHandler(c, err.Error())
	}
}
