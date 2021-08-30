import { RequestHandler, ErrorRequestHandler } from "express";
import createHttpError from "http-errors";

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

// Express is silly, and requires the 4th arg to send json instead of html error...
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.locals.message = err?.message ?? "Not found!";
  res.locals.error = req.app.get("env") === "development" ? err : {};

  const errorResponse = getSimpleErrorResponse(res.locals.message);

  res.status(err?.status ?? 500).json(errorResponse);
  return;
};
