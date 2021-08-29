import { RequestHandler } from "express";
import Post from "../models/Post";
import User from "../models/User";
import {
  verifyToken,
  verifySameUser,
  hashPassword,
} from "../middleware/authentication";
import {
  validatePasswordsMatch,
  validatePassword,
  validateUsername,
  passwordValidator,
} from "../middleware/userValidators";
import { ifPresent, validatorHandler } from "../middleware/validatorHandler";
import { castObjectId } from "../utils/mongooseHelpers";
import { postValidators } from "../middleware/postValidators";

// * Controllers

export const getUser: RequestHandler = async (req, res, next) => {
  const userId = castObjectId(req.params.userid);

  if (!userId) {
    return next();
  }

  const user = await User.findById(userId, "username").exec().catch(next);
  res.json(user);
};

const getAllUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find({}).select("username").exec().catch(next);
  res.json(users);
};

const putUserInDatabase: RequestHandler = async (req, res, next) => {
  const userId = castObjectId(req.params.userid);

  if (!userId) {
    return next();
  }

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
  const userId = castObjectId(req.params.userid);

  if (!userId) {
    return next();
  }

  const user = await User.findByIdAndDelete(userId).catch(next);

  if (user) {
    return res.json(user);
  } else {
    // TODO: double check error format is consistent
    return res.status(400).json({ errors: [{ msg: "User not found!" }] });
  }
};

// User resources
export const getUserPostsFromDatabase: RequestHandler = async (
  req,
  res,
  next
) => {
  // find posts with matching author, with publish dates NOT in the future
  // sort by descending publishDate
  const author = castObjectId(req.params.userid);

  if (!author) {
    return next();
  }

  const currentDate = new Date();
  const posts = await Post.find({ author, publishDate: { $lte: currentDate } })
    .sort({ publishDate: -1 })
    .populate("author", "-password")
    .exec()
    .catch(next);

  posts ? res.json(posts) : res.json({ errors: [{ msg: "No user posts" }] });
};

export const postUserPostToDatabase: RequestHandler = async (
  req,
  res,
  next
) => {
  const { title, content, publishDate } = req.body;

  // should already be verified by preceding middleware
  const author = castObjectId(req.params.userid);

  if (!author) {
    return next();
  }

  const post = await new Post({
    title,
    content,
    author,
    publishDate,
  })
    .save()
    .catch(next);

  res.json(post);
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
  // TODO: properly handle validation of optional params
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
  ...passwordValidator,
  verifyToken,
  verifySameUser,
  deleteUserFromDatabase,
];

// user resources
export const getUserPosts: RequestHandler[] = [getUserPostsFromDatabase];

export const postUserPost: RequestHandler[] = [
  verifyToken,
  verifySameUser,
  ...postValidators,
  postUserPostToDatabase,
];
