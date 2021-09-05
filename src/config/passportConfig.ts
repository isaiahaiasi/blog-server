import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JwtStrategy,
  SecretOrKeyProvider,
  JwtFromRequestFunction,
} from "passport-jwt";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import jwt_decode from "jwt-decode";
import { JWT_SECRET } from "../utils/secrets";
import createDebug from "debug";
import userQueries from "../queries/userQueries";
import { IUser } from "../models/User";

const debug = createDebug("app:auth");

const ACCESS_TOKEN_LIFE = 5 * 60 * 1000; // 5 minutes

type AccessToken = Partial<IUser> & {
  _id?: string;
  // TODO: expiry
  // TODO: createdAt?
};

// get user-specific secret from db & append to server secret
const getSecret = async (userId: string) => {
  const userSecret = await userQueries.getUserSecretFromDB(userId);
  return JWT_SECRET + userSecret;
};

// TODO: generate a token id/user secret (prob just use nanoid)
const generateUserSecret = (): string => "todo";

const secretOrKeyProvider: SecretOrKeyProvider = async (
  req,
  rawJwtToken,
  done
) => {
  const decodedJwt = jwt_decode(rawJwtToken) as AccessToken;
  const userId = decodedJwt._id;

  if (!userId) {
    return done({ message: "No userid cookie found." });
  }

  const secret = await getSecret(userId);

  if (secret) {
    return done(null, secret);
  } else {
    return done({ message: "Could not generate token for user." });
  }
};

const getSignedToken = async (
  content: Record<string, unknown>,
  userId: string
): Promise<string> => jwt.sign(content, await getSecret(userId));

const extractTokenFromCookie: JwtFromRequestFunction = (req) =>
  req && req.cookies ? req.cookies["jwt_a"] : null;

// TODO: implement refresh tokens
const getAccessTokenStrategy = (): JwtStrategy => {
  return new JwtStrategy(
    {
      jwtFromRequest: extractTokenFromCookie,
      secretOrKeyProvider,
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

// TODO: instead of just grabbing user from db, set a new `tkey`
// Each new authentication should invalidate existing tokens
// TODO: this isn't great from a usability perspective with multiple clients...
// Putting these into one trip is more efficient
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

export {
  ACCESS_TOKEN_LIFE,
  getLocalStrategy,
  getAccessTokenStrategy,
  getSignedToken,
  generateUserSecret,
};
