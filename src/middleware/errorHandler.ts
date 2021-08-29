import { RequestHandler, ErrorRequestHandler } from "express";
import createHttpError from "http-errors";
import createDebug from "debug";
const debug = createDebug("app:endpoints");

// Custom error response generators
interface SingleErrorResponse {
  msg: string;
}

interface ErrorResponse {
  errors: SingleErrorResponse[];
}

export const getSimpleErrorResponse = (msg: string): ErrorResponse => {
  return {
    errors: [{ msg: msg }],
  };
};

export const getNotFoundErrorResponse = (name: string): ErrorResponse => ({
  errors: [{ msg: `${name} not found` }],
});

// Express-Generator error handlers
export const catch404: RequestHandler = (req, res, next) => {
  next(createHttpError(404));
};

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res.locals.message = err?.message ?? "Not found!";
  res.locals.error = req.app.get("env") === "development" ? err : {};

  const errorResponse = getSimpleErrorResponse(res.locals.message);
  debug("error handler: %O", errorResponse);

  res.status(err?.status ?? 500).json(errorResponse);
  return;
};
