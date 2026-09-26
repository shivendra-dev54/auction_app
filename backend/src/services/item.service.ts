import { eq } from "drizzle-orm";

import { db } from "../db";
import { item } from "../db/schema/item.schema";

import { ApiError } from "../errors/ApiError";
import { HTTP_RESPONSE } from "../constants/response_codes";


export const createItem = async (
  itemname: string,
  userId: number,
) => {
  const [newItem] = await db
    .insert(item)
    .values({
      itemname,
      user_id: userId,
      is_sold: false,
    })
    .returning();

  return newItem;
};


export const getAllItems = async () => {
  return db
    .select()
    .from(item);
};


export const getItem = async (
  itemId: number,
) => {
  const [result] = await db
    .select()
    .from(item)
    .where(eq(item.id, itemId))
    .limit(1);

  if (!result) {
    throw new ApiError(
      HTTP_RESPONSE.NOT_FOUND,
      "Item not found",
    );
  }

  return result;
};


export const updateItem = async (
  itemId: number,
  userId: number,
  itemname?: string,
) => {
  const existingItem = await getItem(itemId);

  if (existingItem.user_id !== userId) {
    throw new ApiError(
      HTTP_RESPONSE.FORBIDDEN,
      "You do not own this item",
    );
  }

  const [updatedItem] = await db
    .update(item)
    .set({
      ...(itemname !== undefined && {
        itemname,
      }),
    })
    .where(eq(item.id, itemId))
    .returning();

  return updatedItem;
};


export const deleteItem = async (
  itemId: number,
  userId: number,
) => {
  const existingItem = await getItem(itemId);

  if (existingItem.user_id !== userId) {
    throw new ApiError(
      HTTP_RESPONSE.FORBIDDEN,
      "You do not own this item",
    );
  }

  const [deletedItem] = await db
    .delete(item)
    .where(eq(item.id, itemId))
    .returning();

  return deletedItem;
};