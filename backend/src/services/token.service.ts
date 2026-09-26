import jwt from "jsonwebtoken";
import { ApiError } from "../errors/ApiError";
import { HTTP_RESPONSE } from "../constants/response_codes";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are not configured");
}

export const generateAccessToken = (userId: number) => {
  return jwt.sign(
    { userId },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign(
    { userId },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as {
      userId: number;
    };
  } catch {
    throw new ApiError(
      HTTP_RESPONSE.UNAUTHORIZED,
      "Invalid or expired refresh token",
    );
  }
};