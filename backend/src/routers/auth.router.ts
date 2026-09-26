import express from "express";

import {
  signup_controller,
  signin_controller,
  refresh_controller,
  logout_controller,
} from "../controllers/auth.controller";

const auth_router = express.Router();

auth_router
  .route("/api/auth/signup")
  .post(signup_controller);

auth_router
  .route("/api/auth/signin")
  .post(signin_controller);

auth_router
  .route("/api/auth/refresh")
  .post(refresh_controller);

auth_router
  .route("/api/auth/logout")
  .post(logout_controller);

export default auth_router;