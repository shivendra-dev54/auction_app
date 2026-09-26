import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { HTTP_RESPONSE } from "../constants/response_codes";
import { ApiError } from "../errors/ApiError";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export const auth_middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    throw new ApiError(
      HTTP_RESPONSE.UNAUTHORIZED,
      "Access token is required",
    );
  }

  try {
    const payload = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET,
    ) as {
      userId: number;
    };

    if (!payload.userId) {
      throw new ApiError(
        HTTP_RESPONSE.UNAUTHORIZED,
        "Invalid access token",
      );
    }

    // Server-controlled authenticated user ID
    req.headers["x-user-id"] = String(payload.userId);

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      HTTP_RESPONSE.UNAUTHORIZED,
      "Invalid or expired access token",
    );
  }
};