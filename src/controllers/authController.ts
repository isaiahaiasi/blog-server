import { RequestHandler } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../utils/secrets";

// TODO: set up a protected route using middleware/authentication

const authenticateUser: RequestHandler = (req, res, next) => {
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

      const token = jwt.sign(user, JWT_SECRET);

      return res.json({ user, token });
    });
  })(req, res, next);
};

export const postLogin: RequestHandler[] = [authenticateUser];
