import type { Request, Response } from "express";

import {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem,
} from "../services/item.service";

import { HTTP_RESPONSE } from "../constants/response_codes";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../errors/ApiError";


const getUserId = (req: Request): number => {
  const userId = Number(req.headers["x-user-id"]);

  if (!userId || Number.isNaN(userId)) {
    throw new ApiError(
      HTTP_RESPONSE.UNAUTHORIZED,
      "Invalid user identity",
    );
  }

  return userId;
};


export const create_item_controller = async (
  req: Request,
  res: Response,
) => {
  const { itemname } = req.body;
  const userId = getUserId(req);

  if (!itemname) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "itemname is required",
    );
  }

  const result = await createItem(
    itemname,
    userId,
  );

  return res
    .status(HTTP_RESPONSE.CREATED.STATUS_CODE)
    .json(
      new ApiResponse(
        "Item created successfully",
        result,
        true,
      ),
    );
};


export const get_all_items_controller = async (
  req: Request,
  res: Response,
) => {
  getUserId(req);

  const result = await getAllItems();

  return res
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse(
        HTTP_RESPONSE.OK.MESSAGE,
        result,
        true,
      ),
    );
};


export const get_item_controller = async (
  req: Request,
  res: Response,
) => {
  getUserId(req);

  const itemId = Number(req.params.id);

  if (Number.isNaN(itemId)) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "Invalid item ID",
    );
  }

  const result = await getItem(itemId);

  return res
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse(
        HTTP_RESPONSE.OK.MESSAGE,
        result,
        true,
      ),
    );
};


export const update_item_controller = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const itemId = Number(req.params.id);

  if (Number.isNaN(itemId)) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "Invalid item ID",
    );
  }

  const { itemname } = req.body;

  if (!itemname) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "itemname is required",
    );
  }

  const result = await updateItem(
    itemId,
    userId,
    itemname,
  );

  return res
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse(
        "Item updated successfully",
        result,
        true,
      ),
    );
};


export const delete_item_controller = async (
  req: Request,
  res: Response,
) => {
  const userId = getUserId(req);
  const itemId = Number(req.params.id);

  if (Number.isNaN(itemId)) {
    throw new ApiError(
      HTTP_RESPONSE.BAD_REQUEST,
      "Invalid item ID",
    );
  }

  const result = await deleteItem(
    itemId,
    userId,
  );

  return res
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(
      new ApiResponse(
        "Item deleted successfully",
        result,
        true,
      ),
    );
};