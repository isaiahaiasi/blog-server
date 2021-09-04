import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { JWT_SECRET } from "../utils/secrets";
import createDebug from "debug";
import userQueries from "../queries/userQueries";

const debug = createDebug("app:auth");

const getLocalStrategy = (): LocalStrategy => {
  return new LocalStrategy(async (username, password, done) => {
    // get user
    try {
      const user = await userQueries.getUserFromDB({ username });

      if (!user) {
        return done(null, false, {
          message: "Incorrect username",
        });
      }

      // compare user password to input password
      const res = await compare(password, user.password);

      if (res) {
        return done(null, user, { message: "Login successful" });
      } else {
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      done(err);
    }
  });
};

// ? I do not remember why I'm parse-stringifying this...
const getToken = (content: Record<string, unknown>, secret?: string): string =>
  jwt.sign(content, JWT_SECRET + (secret ?? ""));

// TODO: add USER secret
// TODO: add expiry
// TODO: refresh tokens
const getJwtStrategy = (): JwtStrategy => {
  return new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      // TODO: ? omit the call to the db, since the user info IS the jwtPayload?
      debug("jwtPayload:%O", jwtPayload);

      try {
        const user = await userQueries.getUserFromDBById(jwtPayload._id);

        return user
          ? done(null, user)
          : done(null, false, { message: "Could not find user!" });
      } catch (err) {
        done(err);
      }
    }
  );
};

export { getLocalStrategy, getJwtStrategy, getToken };
