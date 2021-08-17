// Both user & auth controllers share these validators
import { body } from "express-validator";
import User from "../models/User";

import createDebug from "debug";
const debug = createDebug("app:validation");

// TODO: sanitization?

export const validateUsername = body("username")
  .trim()
  .isLength({ min: 4 })
  .withMessage("Username must be at least 4 characters long.")
  // verify username is unique:
  .custom(async (value) => {
    const matchingUser = await User.findOne({ username: value })
      .exec()
      .catch((err) => {
        debug(err);
        throw new Error("Something went wrong!");
      });

    if (matchingUser) {
      throw new Error(`Username "${matchingUser.username}" already exists`);
    } else {
      return true;
    }
  });

export const validatePassword = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

// is there a way to check password matches, without req???
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
); // ? Do I need withMessage for this?
