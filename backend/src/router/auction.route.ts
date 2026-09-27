import express from "express";
import {
  create_auction_controller,
  get_ongoing_auctions_controller,
  get_auction_history_controller,
  get_past_auction_by_id_controller,
} from "../controller/auction.controller";
import { auth_middleware } from "../middleware/auth.middleware";

const auction_router = express.Router();

auction_router.post(
  "/api/auctions",
  auth_middleware,
  create_auction_controller,
);

auction_router.get(
  "/api/auctions/ongoing",
  auth_middleware,
  get_ongoing_auctions_controller,
);

auction_router.get(
  "/api/auctions/history",
  auth_middleware,
  get_auction_history_controller,
);

auction_router.get(
  "/api/auctions/:id",
  auth_middleware,
  get_past_auction_by_id_controller,
);

export default auction_router;