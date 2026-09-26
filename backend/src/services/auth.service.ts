import bcrypt from "bcrypt";

import { eq, or } from "drizzle-orm";

import { db } from "../db";
import { users } from "../db/schema/user.schema";

import { ApiError } from "../errors/ApiError";
import { HTTP_RESPONSE } from "../constants/response_codes";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./token.service";

const SALT_ROUNDS = 12;

export const signup = async (
  username: string,
  email: string,
  password: string,
) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.username, username),
        eq(users.email, email),
      ),
    )
    .limit(1);

  if (existingUser.length > 0) {
    throw new ApiError(
      HTTP_RESPONSE.CONFLICT,
      "Username or email already exists",
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    SALT_ROUNDS,
  );

  const [user] = await db
    .insert(users)
    .values({
      username,
      email,
      password: passwordHash,
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
    });

  return user;
};

export const signin = async (
  email: string,
  password: string,
) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new ApiError(
      HTTP_RESPONSE.UNAUTHORIZED,
      "Invalid email or password",
    );
  }

  const passwordValid = await bcrypt.compare(
    password,
    user.password,
  );

  if (!passwordValid) {
    throw new ApiError(
      HTTP_RESPONSE.UNAUTHORIZED,
      "Invalid email or password",
    );
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
};

export const refresh = async (refreshToken: string) => {
  const { userId } = verifyRefreshToken(refreshToken);

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    throw new ApiError(
      HTTP_RESPONSE.UNAUTHORIZED,
      "User no longer exists",
    );
  }

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
  };
};