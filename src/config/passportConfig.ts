import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  SecretOrKeyProvider,
} from "passport-jwt";
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

// append user-specific secret to app secret
const getSecret = (userSecret: string) => JWT_SECRET + userSecret;

const generateSecret: SecretOrKeyProvider = async (req, rawJwtToken, done) => {
  // TODO: implement express cookie parser
  // const userid = req.cookies.userid;
  const userid = "hello";

  if (!userid) {
    return done({ message: "No userid cookie found." });
  }

  const userSecret = "todo"; // get user secret from db
  if (userSecret) {
    return done(null, getSecret(userSecret));
  } else {
    return done({ message: "Could not generate token for user." });
  }
};

const getToken = (content: Record<string, unknown>, secret: string): string =>
  jwt.sign(content, getSecret(secret));

// TODO: add USER secret
// TODO: add expiry
// TODO: refresh tokens
const getJwtStrategy = (): JwtStrategy => {
  return new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: generateSecret,
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
