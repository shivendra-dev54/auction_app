import type { Request, Response } from "express"
import { HTTP_RESPONSE } from "../constants/response_codes"
import { ApiResponse } from "../utils/ApiResponse"

export const health_controller = async (req: Request, res: Response) => {
  res
    .status(HTTP_RESPONSE.OK.STATUS_CODE)
    .json(new ApiResponse(HTTP_RESPONSE.OK.MESSAGE, {}, true));
  return;
}