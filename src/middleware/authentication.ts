import { RequestHandler } from "express";
import passport from "passport";

export const authorizeUser: RequestHandler = passport.authenticate("jwt", {
  session: false,
});
