import { RequestHandler, ErrorRequestHandler } from "express";
import createHttpError from "http-errors";

// Express-Generator error handlers

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

export const getNotFoundErrorResponse = (name: string) => ({
  errors: [{ msg: `${name} not found` }],
});
