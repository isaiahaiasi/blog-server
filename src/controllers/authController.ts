import { RequestHandler } from "express";
import passport from "passport";
import {
  validatePasswordsMatch,
  validatePassword,
  validateUsername,
} from "../middleware/userValidators";
import { validatorHandler } from "../middleware/validatorHandler";
import { hashPassword } from "../middleware/authentication";
import userQueries from "../queries/userQueries";
import {
  generateUserSecret,
  getSignedToken,
  setAuthCookies,
} from "../config/passportConfig";
import createLogger from "../utils/debugHelper";
import { getSimpleError } from "../middleware/errorHandler";
import {
  APIErrorResponse,
  LoginResponse,
  RegistrationResponse,
  sendAPIResponse,
} from "../responses/responseInterfaces";

const log = createLogger("auth");

const loginUser: RequestHandler = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      log("no user!");
      return res.status(400).json(info);
    }

    req.login(user, { session: false }, async (err) => {
      if (err) {
        res.json(err);
        return;
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
      return sendAPIResponse<APIErrorResponse>(
        res,
        {
          success: false,
          content: null,
          errors: [getSimpleError("Could not create new user record")],
        },
        500
      );
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
