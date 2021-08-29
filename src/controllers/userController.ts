import { RequestHandler } from "express";
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
import { postValidators } from "../middleware/postValidators";
import userQueries from "../db-queries/userQueries";
import {
  getNotFoundErrorResponse,
  getSimpleErrorResponse,
} from "../middleware/errorHandler";
import blogQueries from "../db-queries/blogQueries";

const getUserFromDBHandler: RequestHandler = async (req, res, next) => {
  const { userid } = req.params;

  try {
    const user = await userQueries.getUserFromDBById(userid);
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
  try {
    const user = await userQueries.deleteUserFromDB(req.params.userid);

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

// User resources
export const getUserPostsFromDatabase: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const posts = await blogQueries.getPublishedUserBlogsFromDB(
      req.params.userid
    );

    return posts && Array.isArray(posts) && posts.length > 0
      ? res.json(posts)
      : res.json(getSimpleErrorResponse("No user posts"));
  } catch (err) {
    next(err);
  }
};

export const postUserPostToDatabase: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { title, content, publishDate } = req.body;

    const post = blogQueries.addBlogToDB({
      title,
      content,
      publishDate,
      author: req.params.userid,
    });

    return post
      ? res.json(post)
      : res
          .status(500)
          .json(getSimpleErrorResponse("Could not add blog post to database."));
  } catch (err) {
    next(err);
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
