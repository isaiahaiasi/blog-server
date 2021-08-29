import { RequestHandler } from "express";
import Post from "../models/Post";
import { IUser } from "../models/User";
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
import userQueries from "../db-queries/userQueries";
import { getNotFoundErrorResponse } from "../middleware/errorHandler";

const getUserFromDBHandler: RequestHandler = async (req, res, next) => {
  const { userid } = req.params;

  try {
    const user = await userQueries.getUserFromDB(userid);
    if (user) {
      res.json(user);
    } else {
      res.json(getNotFoundErrorResponse(userid));
    }
  } catch (err) {
    next(err);
  }
};

const getAllUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    const users = await userQueries.getAllUsersFromDB();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const putUserInDBHandler: RequestHandler = async (req, res, next) => {
  const updatedUser: Partial<IUser> = {};

  if (req.body.username) {
    updatedUser.username = req.body.username;
  }
  if (req.body.password) {
    updatedUser.password = await hashPassword(req.body.password);
  }

  try {
    const user = await userQueries.putUserInDB(req.params.id, updatedUser);

    if (user) {
      return res.json(user);
    } else {
      return res
        .status(400)
        .json(getNotFoundErrorResponse(`User ${req.params.id}`));
    }
  } catch (err) {
    next(err);
  }
};

const deleteUserFromDatabase: RequestHandler = async (req, res, next) => {
  const user = await userQueries.deleteUserFromDB(req.params.userid);

  if (user) {
    return res.json(user);
  } else {
    return res
      .status(400)
      .json(getNotFoundErrorResponse(`User ${req.params.id}`));
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

export const getUser: RequestHandler[] = [getUserFromDBHandler];

export const getUserVerified: RequestHandler[] = [
  verifyToken,
  // verifySameUser,
  getUserFromDBHandler,
];

export const getUsers: RequestHandler[] = [
  // verifyToken,
  getAllUsersHandler,
];

export const putUser: RequestHandler[] = [
  // TODO: properly handle validation of optional params
  ifPresent(validateUsername, "username"),
  ifPresent(validatePassword, "password"),
  ifPresent(validatePasswordsMatch, "passwordConfirm"),
  validatorHandler,
  verifyToken,
  verifySameUser,
  putUserInDBHandler,
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
