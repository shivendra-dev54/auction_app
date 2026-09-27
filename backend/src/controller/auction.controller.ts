import type { Request, Response } from "express";
import { HTTP_RESPONSE } from "../constants/response_codes";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../errors/ApiError";
import {
  createAuction,
  getOngoingAuctions,
  getAuctionHistory,
  getPastAuctionById,
} from "../services/auction.service";

export const create_auction_controller = async (
  req: Request,
  res: Response,
) => {
  const userId = Number(req.headers["x-user-id"]);
  const { itemId, startingBid } = req.body;

  if (!itemId || startingBid === undefined) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "itemId and startingBid are required",
    );
  }

  const parsedItemId = Number(itemId);
  const parsedStartingBid = Number(startingBid);

  if (isNaN(parsedItemId) || isNaN(parsedStartingBid) || parsedStartingBid <= 0) {
    throw new ApiError(
      HTTP_RESPONSE.UNPROCESSABLE_ENTITY,
      "itemId must be valid and startingBid must be greater than 0",
    );
  }

  const auction = await createAuction(
    userId,
    parsedItemId,
    parsedStartingBid,
  );

  return res
    .status(HTTP_RESPONSE.CREATED.STATUS_CODE)
    .json(
      new ApiResponse("Auction initialized in memory", auction, true),
    );
};

export const get_ongoing_auctions_controller = async (
  _req: Request,
  res: Response,
) => {
  const ongoing = getOngoingAuctions();

  return res
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse("Ongoing auctions retrieved", ongoing, true),
    );
};

export const get_auction_history_controller = async (
  req: Request,
  res: Response,
) => {
  const userId = Number(req.headers["x-user-id"]);
  const history = await getAuctionHistory(userId);

  return res
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse("Auction history retrieved", history, true),
    );
};

export const get_past_auction_by_id_controller = async (
  req: Request,
  res: Response,
) => {
  const userId = Number(req.headers["x-user-id"]);
  const auctionId = Number(req.params.id);

  if (isNaN(auctionId)) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "Invalid auction ID parameter",
    );
  }

  const auctionDetails = await getPastAuctionById(auctionId, userId);

  return res
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse("Auction details retrieved", auctionDetails, true),
    );
};