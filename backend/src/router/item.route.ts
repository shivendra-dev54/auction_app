import express from "express";

import {
  create_item_controller,
  get_all_items_controller,
  get_item_controller,
  update_item_controller,
  delete_item_controller,
} from "../controller/item.controller";
import { auth_middleware } from "../middleware/auth.middleware";


const item_router = express.Router();


item_router
  .route("/api/items")
  .post(
    auth_middleware,
    create_item_controller,
  )
  .get(
    auth_middleware,
    get_all_items_controller,
  );


item_router
  .route("/api/items/:id")
  .get(
    auth_middleware,
    get_item_controller,
  )
  .patch(
    auth_middleware,
    update_item_controller,
  )
  .delete(
    auth_middleware,
    delete_item_controller,
  );


export default item_router;