// Both user & auth controllers share these validators

import { body } from "express-validator";
import User from "../models/user";

// TODO: sanitization?

export const usernameValidator = body("username")
  .trim()
  .isLength({ min: 4 })
  .withMessage("Username must be at least 4 characters long.")
  // verify username is unique:
  .custom(async (value) => {
    const matchingUser = await User.findOne({ username: value })
      .exec()
      .catch((err) => {
        console.log(err);
        throw new Error("Something went wrong!");
      });

    if (matchingUser) {
      throw new Error(`Username "${matchingUser.username}" already exists`);
    } else {
      return true;
    }
  });

export const passwordValidator = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

// is there a way to check password matches, without req???
// because then I could just use .equals()...
export const passwordsMatchValidator = body("passwordConfirm").custom(
  (value, { req }) => {
    console.log(req.body);
    console.log("value:", value);
    console.log("req.body.password:", req.body.password);
    if (value !== req.body.password) {
      throw new Error("Passwords must match!");
    } else {
      return true;
    }
  }
); // ? Do I need withMessage for this?
