import { RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { JWT_SECRET } from "../utils/secrets";
import User from "../models/user";
import {
  passwordsMatchValidator,
  passwordValidator,
  usernameValidator,
} from "../middleware/userValidators";
import { validatorHandler } from "../middleware/validatorHandler";

const loginUser: RequestHandler = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json(info);
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      // ? I do not remember why I'm parse-stringifying this...
      const token = jwt.sign(JSON.parse(JSON.stringify(user)), JWT_SECRET);

      return res.json({
        user,
        token,
      });
    });
  })(req, res, next);
};

const registerUser: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // hash password
    const pwHash = await bcrypt.hash(password, 10);

    // create user and save
    const user = await new User({ username, password: pwHash }).save();

    res.json({ msg: "Registration successful!", user });
  } catch (err) {
    next(err);
  }
};

// TODO: not sure what validation login form needs...
// I don't necessarily WANT to give errors on invalid usernames/passwords
// I just want to say if login was successful or not
// and possibly sanitize the inputs?
export const postLogin: RequestHandler[] = [loginUser];

export const postRegister: RequestHandler[] = [
  usernameValidator,
  passwordValidator,
  passwordsMatchValidator,
  validatorHandler,
  registerUser,
];
