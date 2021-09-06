import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import createLogger from "../utils/debugHelper";
const debug = createLogger("validation");

export const validatorHandler: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

// runs @validator if @field is present, otherwise just calls next()
// TODO: optionally allow groups of both arguments
// (eg, password should only be updated if "passwordConfirm" field is present)
export const ifPresent =
  (validator: RequestHandler, field: string): RequestHandler =>
  (req, res, next) => {
    debug("if present:", field);
    if (req.body[field]) {
      debug("if present:", true);
      validator(req, res, next);
    } else {
      debug("if present:", false);
      next();
    }
  };
