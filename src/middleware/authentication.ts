import { RequestHandler } from "express";
import passport from "passport";

// ! Don't know where this should actually go...
declare global {
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
  if (req.user && req.user._id === req.params.userid) {
    next();
  } else {
    console.log("Failed user match");
    next({ message: "Failed user match", status: 403 });
  }
};

// ! TEMP - for debugging
export const logHeaders: RequestHandler = (req, res, next) => {
  console.log("headers:", req.headers);
  next();
};
