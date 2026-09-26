export const HTTP_RESPONSE = {
  OK: {
    STATUS_CODE: 200,
    MESSAGE: "Request successful",
  },

  CREATED: {
    STATUS_CODE: 201,
    MESSAGE: "Resource created successfully",
  },

  NO_CONTENT: {
    STATUS_CODE: 204,
    MESSAGE: "No content",
  },

  BAD_REQUEST: {
    STATUS_CODE: 400,
    MESSAGE: "Bad request",
  },

  UNAUTHORIZED: {
    STATUS_CODE: 401,
    MESSAGE: "Unauthorized",
  },

  FORBIDDEN: {
    STATUS_CODE: 403,
    MESSAGE: "Forbidden",
  },

  NOT_FOUND: {
    STATUS_CODE: 404,
    MESSAGE: "Resource not found",
  },

  CONFLICT: {
    STATUS_CODE: 409,
    MESSAGE: "Resource already exists",
  },

  UNPROCESSABLE_ENTITY: {
    STATUS_CODE: 422,
    MESSAGE: "Validation failed",
  },

  INTERNAL_SERVER_ERROR: {
    STATUS_CODE: 500,
    MESSAGE: "Internal server error",
  },

  SERVICE_UNAVAILABLE: {
    STATUS_CODE: 503,
    MESSAGE: "Service unavailable",
  },
} as const;
