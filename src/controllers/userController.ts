import { RequestHandler } from "express";
import { Types } from "mongoose";
import Post from "../models/post";
import User from "../models/user";
import {
  verifyToken,
  verifySameUser,
  hashPassword,
} from "../middleware/authentication";
import {
  validatePasswordsMatch,
  validatePassword,
  validateUsername,
} from "../middleware/userValidators";
import { ifPresent, validatorHandler } from "../middleware/validatorHandler";

// * Controllers

export const getUser: RequestHandler = async (req, res, next) => {
  const userId = Types.ObjectId(req.params.userid);
  console.log("logged in user:", req.user?.username);
  const user = await User.findById(userId, "username").exec().catch(next);
  res.json(user);
};

export const getUserPosts: RequestHandler = async (req, res, next) => {
  const userId = Types.ObjectId(req.params.userid);
  const posts = await Post.find({ author: userId }).exec().catch(next);
  res.json(posts);
};

const getAllUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find({}).select("username").exec().catch(next);
  res.json(users);
};

const putUserInDatabase: RequestHandler = async (req, res, next) => {
  const userId = Types.ObjectId(req.params.userid);

  const updatedUser: {
    username?: string;
    password?: string;
  } = {};

  if (req.body.username) {
    updatedUser.username = req.body.username;
  }
  if (req.body.password) {
    updatedUser.password = await hashPassword(req.body.password);
  }

  const user = await User.findByIdAndUpdate(userId, updatedUser).catch(next);

  if (user) {
    return res.json(user);
  } else {
    // TODO: double check error format consistent
    return res.status(400).json({ errors: [{ msg: "User not found!" }] });
  }
};

const deleteUserFromDatabase: RequestHandler = async (req, res, next) => {
  const userId = Types.ObjectId(req.params.userid);
  const user = await User.findByIdAndDelete(userId).catch(next);

  if (user) {
    return res.json(user);
  } else {
    // TODO: double check error format is consistent
    return res.status(400).json({ errors: [{ msg: "User not found!" }] });
  }
};

// * Controller Arrays
// Group handler with middleware specific to it
// Can be exported and set as a request handler like individual handler
// Typical example:
//   - validation middleware
//   - authentication middleware
//   - authorization middlware
//   - route handler/response )

export const getUserVerified: RequestHandler[] = [
  verifyToken,
  verifySameUser,
  getUser,
];

export const getUsers: RequestHandler[] = [
  // verifyToken,
  getAllUsers,
];

export const putUser: RequestHandler[] = [
  ifPresent(validateUsername, "username"),
  ifPresent(validatePassword, "password"),
  ifPresent(validatePasswordsMatch, "passwordConfirm"),
  validatorHandler,
  verifyToken,
  verifySameUser,
  putUserInDatabase,
];

// requires user to enter their password to delete
export const deleteUser: RequestHandler[] = [
  validatePassword,
  validatorHandler,
  verifyToken,
  verifySameUser,
  deleteUserFromDatabase,
];
