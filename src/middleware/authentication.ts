import { RequestHandler } from "express";
import passport from "passport";

export const verifyToken: RequestHandler = passport.authenticate("jwt", {
  session: false,
});

// ! TEMP - for debugging
export const logHeaders: RequestHandler = (req, res, next) => {
  console.log(req.headers);
  next();
};
