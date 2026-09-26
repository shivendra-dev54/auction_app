import type { ErrorRequestHandler } from "express";
import { HTTP_RESPONSE } from "../constants/response_codes";
import { ApiError } from "../errors/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(
        new ApiResponse(
          err.message,
          {},
          false,
        ),
      );
  }

  return res
    .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.STATUS_CODE)
    .json(
      new ApiResponse(
        HTTP_RESPONSE.INTERNAL_SERVER_ERROR.MESSAGE,
        {},
        false,
      ),
    );
};