import { RequestHandler } from "express";
import { hashPassword } from "../config/passportConfig";
import { verifyToken, verifyUserIsUser } from "../middleware/authentication";
import { postValidators } from "../middleware/postValidators";
import {
  passwordValidator,
  validatePassword,
  validatePasswordsMatch,
  validateUsername,
} from "../middleware/userValidators";
import { ifPresent, validatorHandler } from "../middleware/validatorHandler";
import { IPost } from "../models/Post";
import { IUser } from "../models/User";
import blogQueries from "../queries/blogQueries";
import userQueries from "../queries/userQueries";
import { sendAPIResponse, sendError } from "../responses/responseFactories";
import { APIResponse } from "../responses/responseInterfaces";
import createLogger from "../utils/debugHelper";

const logger = createLogger("endpoints");

const getUserFromDBHandler: RequestHandler = async (req, res, next) => {
  const { userid } = req.params;

  try {
    const user = await userQueries.getUserFromDBById(userid);
    if (user) {
      return sendAPIResponse<APIResponse<IUser>>(res, {
        success: true,
        content: user,
      });
    } else {
      return sendError(res, `${userid} not found.`, 404);
    }
  } catch (err) {
    next(err);
  }
};

const getAllUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    const users = await userQueries.getAllUsersFromDB();

    return sendAPIResponse<APIResponse<IUser[]>>(res, {
      success: true,
      content: users,
    });
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
      return sendAPIResponse<APIResponse<IUser>>(res, {
        success: true,
        content: user,
      });
    } else {
      return sendError(res, `User ${req.params.id} not found.`, 404);
    }
  } catch (err) {
    next(err);
  }
};

const deleteUserFromDatabase: RequestHandler = async (req, res, next) => {
  try {
    const user = await userQueries.deleteUserFromDB(req.params.userid);

    if (user) {
      return sendAPIResponse<APIResponse<IUser>>(res, {
        success: true,
        content: user,
      });
    } else {
      return sendError(res, `User ${req.params.id} not found.`, 404);
    }
  } catch (err) {
    next(err);
  }
};

// * User resources
export const getUserPostsFromDatabase: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    logger("Getting posts for " + req.params.userid);

    const posts = await blogQueries.getPublishedUserBlogsFromDB(
      req.params.userid
    );

    return posts && Array.isArray(posts) && posts.length > 0
      ? sendAPIResponse<APIResponse<IPost[]>>(res, {
          success: true,
          content: posts,
        })
      : sendError(res, "No user posts.", 400);
  } catch (err) {
    next(err);
  }
};

// Retrieve both published and unpublished blog posts
export const getAllUserPostsFromDatabase: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const userId = req.params.userid;

    logger("Getting published & unpublished posts for " + userId);

    const posts = await blogQueries.getAllUserBlogsFromDB(userId);

    return posts && Array.isArray(posts) && posts.length > 0
      ? sendAPIResponse<APIResponse<IPost[]>>(res, {
          success: true,
          content: posts,
        })
      : sendError(res, "No user posts.", 400);
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

    const post = await blogQueries.addBlogToDB({
      title,
      content,
      publishDate,
      author: req.params.userid,
    });

    if (post) {
      logger("Post added to DB", post);

      return sendAPIResponse<APIResponse<IPost>>(res, {
        success: true,
        content: post,
      });
    } else {
      return sendError(res, "Could not add blog post to database.", 500);
    }
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
  verifyUserIsUser(),
  getUserFromDBHandler,
];

export const getUsers: RequestHandler[] = [getAllUsersHandler];

// TODO: properly handle validation of optional params
// TODO: not sure PUT is appropriate here
// (since this is a partial update, not replacing the record...)
export const putUser: RequestHandler[] = [
  ifPresent(validateUsername, "username"),
  ifPresent(validatePassword, "password"),
  ifPresent(validatePasswordsMatch, "passwordConfirm"),
  validatorHandler,
  verifyToken,
  verifyUserIsUser(),
  putUserInDBHandler,
];

// requires user to enter their password to delete
export const deleteUser: RequestHandler[] = [
  ...passwordValidator,
  verifyToken,
  verifyUserIsUser(),
  deleteUserFromDatabase,
];

// user resources
export const getUserPosts: RequestHandler[] = [getUserPostsFromDatabase];

export const getAllUserPosts: RequestHandler[] = [
  verifyToken,
  verifyUserIsUser(),
  getAllUserPostsFromDatabase,
];

export const postUserPost: RequestHandler[] = [
  // TODO: validation
  verifyToken,
  verifyUserIsUser(),
  ...postValidators,
  postUserPostToDatabase,
];
