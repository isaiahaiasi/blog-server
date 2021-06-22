import { RequestHandler, ErrorRequestHandler } from "express";
import createHttpError from "http-errors";

// (just the express-generator error handlers at the moment)

export const catch404: RequestHandler = (req, res, next) => {
  next(createHttpError(404));
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log("error handler");
  res.locals.message = err?.message ?? "Not found!";
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err?.status ?? 500);
  res.json({ errors: [{ msg: res.locals.message }] });
};
