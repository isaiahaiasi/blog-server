// Both user & auth controllers share these validators
import { body } from "express-validator";
import User from "../models/User";

import createDebug from "debug";
import { validatorHandler } from "./validatorHandler";
import userQueries from "../db-queries/userQueries";
const debug = createDebug("app:validation");

// TODO: sanitization?

export const validateUsername = body("username")
  .trim()
  .isLength({ min: 4 })
  .withMessage("Username must be at least 4 characters long.")
  // verify username is unique:
  .custom(async (value) => {
    const matchingUser = await userQueries.getUserFromDB({ username: value });

    if (matchingUser) {
      throw new Error(`Username "${matchingUser.username}" already exists`);
    } else {
      return true;
    }
  });

export const validatePassword = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

// is there a way to check password matches, without req?
// because then I could just use .equals()...
export const validatePasswordsMatch = body("passwordConfirm").custom(
  (value, { req }) => {
    debug(req.body);
    debug("value: (arg to validatePasswordsMatch)", value);
    if (value !== req.body.password) {
      throw new Error("Passwords must match!");
    } else {
      return true;
    }
  }
);

// not really sure what the best way to group these is
//! NOTE: currently the "validatorHandler" middleware MUST follow the validators

export const passwordValidator = [validatePassword, validatorHandler];

export const loginValidators = [
  validateUsername,
  validatePassword,
  validatorHandler,
];

export const registrationValidators = [
  ...loginValidators,
  validatePasswordsMatch,
  validatorHandler,
];
