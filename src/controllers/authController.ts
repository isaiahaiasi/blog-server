import { RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/secrets";
import {
  validatePasswordsMatch,
  validatePassword,
  validateUsername,
} from "../middleware/userValidators";
import { validatorHandler } from "../middleware/validatorHandler";
import { hashPassword } from "../middleware/authentication";
import userQueries from "../queries/userQueries";
import { getSimpleErrorResponse } from "../middleware/errorHandler";
import { LoginResponse, RegistrationResponse } from "../utils/response-types";

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

      const responseContent: LoginResponse = { user, token };

      return res.json(responseContent);
    });
  })(req, res, next);
};

const registerUser: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // hash password
    const pwHash = await hashPassword(password);

    // create user with the pwHash as the pw
    const user = await userQueries.addUserToDB({ username, password: pwHash });

    if (user) {
      const responseContent: RegistrationResponse = {
        user,
        msg: "Registration successful!",
      };

      res.json(responseContent);
    } else {
      res
        .status(400)
        .json(getSimpleErrorResponse("Could not create new user record"));
    }
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
  validateUsername,
  validatePassword,
  validatePasswordsMatch,
  validatorHandler,
  registerUser,
];
