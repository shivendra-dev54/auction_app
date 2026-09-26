import type { HTTP_RESPONSE } from "../constants/response_codes";

type HttpResponse = (typeof HTTP_RESPONSE)[keyof typeof HTTP_RESPONSE];

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(
    response: HttpResponse,
    message?: string,
  ) {
    super(message ?? response.MESSAGE);

    this.name = "ApiError";
    this.statusCode = response.STATUS_CODE;

    Error.captureStackTrace(this, this.constructor);
  }
}