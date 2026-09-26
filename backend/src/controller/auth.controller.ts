import type { Request, Response } from "express";

import { HTTP_RESPONSE } from "../constants/response_codes";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../errors/ApiError";

import {
  signup,
  signin,
  refresh,
} from "../services/auth.service";


const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};


export const signup_controller = async (
  req: Request,
  res: Response,
) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "Username, email and password are required",
    );
  }

  if (password.length < 8) {
    throw new ApiError(
      HTTP_RESPONSE.UNPROCESSABLE_ENTITY,
      "Password must be at least 8 characters",
    );
  }

  const user = await signup(
    username,
    email,
    password,
  );

  return res
    .status(HTTP_RESPONSE.CREATED.STATUS_CODE)
    .json(
      new ApiResponse(
        "User registered successfully",
        user,
        true,
      ),
    );
};


export const signin_controller = async (
  req: Request,
  res: Response,
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "Email and password are required",
    );
  }

  const {
    user,
    accessToken,
    refreshToken,
  } = await signin(email, password);

  res
    .cookie(
      "access_token",
      accessToken,
      {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      },
    )
    .cookie(
      "refresh_token",
      refreshToken,
      {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    )
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse(
        HTTP_RESPONSE.OK.MESSAGE,
        user,
        true,
      ),
    );
};


export const refresh_controller = async (
  req: Request,
  res: Response,
) => {
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    throw new ApiError(
      HTTP_RESPONSE.UNAUTHORIZED,
      "Refresh token is required",
    );
  }

  const { accessToken } = await refresh(refreshToken);

  return res
    .cookie(
      "access_token",
      accessToken,
      {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
      },
    )
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse(
        "Access token refreshed",
        {},
        true,
      ),
    );
};


export const logout_controller = async (
  req: Request,
  res: Response,
) => {
  return res
    .clearCookie("access_token", COOKIE_OPTIONS)
    .clearCookie("refresh_token", COOKIE_OPTIONS)
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse(
        "Logged out successfully",
        {},
        true,
      ),
    );
};