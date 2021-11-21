import { RequestHandler, ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import {
  APIError,
  APIErrorResponse,
  sendAPIResponse,
} from "../responses/responseInterfaces";

export const getSimpleError = (msg: string): APIError => ({
  msg,
});

export const getNotFoundError = (name: string): APIError => ({
  msg: `${name} not found`,
});

// Express-Generator error handlers
export const catch404: RequestHandler = (req, res, next) => {
  next(createHttpError(404));
};

// Express is silly, and requires the 4th arg to send json instead of html error...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.locals.message = err?.message ?? "Not found!";
  res.locals.error = req.app.get("env") === "development" ? err : {};

  return sendAPIResponse<APIErrorResponse>(
    res,
    {
      success: false,
      content: null,
      errors: [{ msg: res.locals.message }],
    },
    500
  );
};
