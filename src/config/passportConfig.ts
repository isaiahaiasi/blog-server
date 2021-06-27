import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { compare } from "bcryptjs";

import User from "../models/user";

import { JWT_SECRET } from "../utils/secrets";

// TODO: REGISTERING new user

const getLocal = () => {
  return new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username }).exec().catch(done);

    if (!user) {
      return done(null, false, {
        message: "Incorrect username",
      });
    }

    const res = await compare(password, user.password).catch(done);

    if (!res) {
      return done(null, false, {
        message: "Incorrect password",
      });
    }

    return done(null, user, { message: "Login successful" });
  });
};

// TODO: should it be timed?...
const getJwt = () => {
  return new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      console.log(jwtPayload);
      const user = await User.findById(jwtPayload._id).exec().catch(done);

      console.log(user);
      if (!user) {
        return done(null, false, {
          message: "Could not find user!",
        });
      }

      return done(null, user);
    }
  );
};

export { getLocal, getJwt };
