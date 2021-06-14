import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import createHttpError from "http-errors";

// (just the express-generator error handlers at the moment)

export const catch404 = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(createHttpError(404));
};

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
};
