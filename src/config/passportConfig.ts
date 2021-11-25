import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JwtStrategy,
  SecretOrKeyProvider,
  JwtFromRequestFunction,
} from "passport-jwt";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { JWT_SECRET } from "./secrets";
import userQueries from "../queries/userQueries";
import { CookieOptions, Response } from "express";
import { nanoid } from "nanoid";
import { IUser } from "../models/User";
import createLogger from "../utils/debugHelper";
import bcrypt from "bcryptjs";

const debug = createLogger("auth");

const ACCESS_TOKEN_LIFE = 60 * 60 * 1000; // 60 minutes

const generateUserSecret = (): string => nanoid();

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Get user-specific secret from db & append to server secret
const getSecret = async (userId: string) => {
  const userSecret = await userQueries.getUserSecretFromDB(userId);
  return JWT_SECRET + userSecret;
};

const setAuthCookies = (res: Response, jwt_a: string, _id: string): void => {
  const sharedCookieHeaders: Partial<CookieOptions> = {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.cookie("jwt_a", jwt_a, {
    expires: new Date(ACCESS_TOKEN_LIFE + Date.now()),
    ...sharedCookieHeaders,
  });
  res.cookie("uid", _id, sharedCookieHeaders);
  debug("cookies set");
};

const setUserSecret = (userIdentifier: Partial<IUser>) => {
  return userQueries.setUserSecretInDB(userIdentifier, generateUserSecret());
};

const secretOrKeyProvider: SecretOrKeyProvider = async (req, rawJwt, done) => {
  const userId = req.cookies.uid;

  if (!userId) {
    return done({ message: "No userid cookie found." });
  }

  const secret = await getSecret(userId);

  return secret
    ? done(null, secret)
    : done({ message: "Could not get token for user." });
};

const getSignedToken = async (
  content: Record<string, unknown>,
  userId: string
): Promise<string> => jwt.sign(content, await getSecret(userId));

const extractTokenFromCookie: JwtFromRequestFunction = (req) =>
  req && req.cookies ? req.cookies["jwt_a"] : null;

const getAccessTokenStrategy = (): JwtStrategy => {
  return new JwtStrategy(
    {
      jwtFromRequest: extractTokenFromCookie,
      secretOrKeyProvider,
    },
    async (jwtPayload, done) => {
      try {
        const user = await userQueries.getUserFromDBById(jwtPayload._id);

        if (user) {
          debug(`User ${user.username} authenticated successfully.`);
          return done(null, user);
        } else {
          return done(null, false, { message: "Could not find user!" });
        }
      } catch (err) {
        done(err);
      }
    }
  );
};

// Login strategy ()
const getLocalStrategy = (): LocalStrategy => {
  return new LocalStrategy(async (username, password, done) => {
    try {
      const user = await setUserSecret({ username });

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
  getLocalStrategy,
  getAccessTokenStrategy,
  getSignedToken,
  generateUserSecret,
  setAuthCookies,
};
