import { Response } from "express";
import { APIError, APIErrorResponse } from "./responseInterfaces";

export function sendAPIResponse<T>(
  res: Response,
  body: T,
  responseCode = 200
): void {
  res.status(responseCode).json(body);
}

export function sendError(
  res: Response,
  error: string | APIError[],
  responseCode = 500
): void {
  const errors = typeof error === "string" ? [{ msg: error }] : error;

  sendAPIResponse<APIErrorResponse>(
    res,
    {
      success: false,
      content: null,
      errors,
    },
    responseCode
  );
}
