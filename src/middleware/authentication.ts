import { RequestHandler } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import createLogger from "../utils/debugHelper";

const debug = createLogger("auth");

// TODO: Don't know where this should actually go...
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      username: string;
      _id: string;
      iat: number;
    }
  }
}

export const verifyToken: RequestHandler = passport.authenticate("jwt", {
  session: false,
});

export const verifySameUser: RequestHandler = (req, res, next) => {
  if (req.user && req.user._id.toString() === req.params.userid) {
    next();
  } else {
    debug("Failed user match");
    next({ message: "Failed user match", status: 403 });
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};
