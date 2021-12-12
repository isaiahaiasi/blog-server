import { RequestHandler } from "express";
import passport from "passport";
import {
  generateUserSecret,
  getSignedToken,
  hashPassword,
  setAuthCookies,
} from "../config/passportConfig";
import {
  validatePassword,
  validatePasswordsMatch,
  validateUsername,
} from "../middleware/userValidators";
import { validatorHandler } from "../middleware/validatorHandler";
import userQueries from "../queries/userQueries";
import { sendAPIResponse, sendError } from "../responses/responseFactories";
import {
  LoginResponse,
  RegistrationResponse,
} from "../responses/responseInterfaces";
import createLogger from "../utils/debugHelper";

const log = createLogger("auth");

const loginUser: RequestHandler = (req, res, next) => {
  log("logging in user...");
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err) {
      log(err);
      return next(err);
    }

    if (!user) {
      log("no user!");
      return sendError(res, "Could not find user record.", 400);
    }

    // TODO
    // according to the docs, passport.authenticate invokes req.login automatically
    // so my source on this was probably poor,
    // and I should refactor to remove this.
    req.login(user, { session: false }, async (err) => {
      if (err) {
        return sendError(res, [err], 500);
      }

      const { _id, username } = user;
      const userDataToSend = { _id };

      const token = await getSignedToken(userDataToSend, _id);

      setAuthCookies(res, token, _id);

      return sendAPIResponse<LoginResponse>(res, {
        content: { _id, username },
        success: true,
      });
    });
  })(req, res, next);
};

const registerUser: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // hash password
    const pwHash = await hashPassword(password);

    // create user with the pwHash as the pw
    const user = await userQueries.addUserToDB({
      username,
      password: pwHash,
      tkey: generateUserSecret(),
    });

    if (user) {
      return sendAPIResponse<RegistrationResponse>(res, {
        content: user,
        success: true,
      });
    } else {
      return sendError(res, "Could not create new user record", 500);
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
