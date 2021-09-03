import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { compare } from "bcryptjs";
import { JWT_SECRET } from "../utils/secrets";
import createDebug from "debug";
import userQueries from "../queries/userQueries";

const debug = createDebug("app:auth");

const getLocal = (): LocalStrategy => {
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

// TODO: add expiry
// TODO: refresh tokens
const getJwt = (): JwtStrategy => {
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

export { getLocal, getJwt };
