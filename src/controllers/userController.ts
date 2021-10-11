import { RequestHandler } from "express";
import {
  hashPassword,
  verifySameUser,
  verifyToken,
} from "../middleware/authentication";
import { getNotFoundError, getSimpleError } from "../middleware/errorHandler";
import { postValidators } from "../middleware/postValidators";
import {
  passwordValidator,
  validatePassword,
  validatePasswordsMatch,
  validateUsername,
} from "../middleware/userValidators";
import { ifPresent, validatorHandler } from "../middleware/validatorHandler";
import { IUser } from "../models/User";
import blogQueries from "../queries/blogQueries";
import userQueries from "../queries/userQueries";
import { APIErrorResponse } from "../responses/generalInterfaces";
import {
  APIBlogListResponse,
  APIBlogResponse,
  APIUserListResponse,
  APIUserResponse,
  sendAPIResponse,
} from "../responses/responseInterfaces";
import createLogger from "../utils/debugHelper";

const logger = createLogger("endpoints");

const getUserFromDBHandler: RequestHandler = async (req, res, next) => {
  const { userid } = req.params;

  try {
    const user = await userQueries.getUserFromDBById(userid);
    if (user) {
      return sendAPIResponse<APIUserResponse>(res, {
        success: true,
        content: user,
      });
    } else {
      return sendAPIResponse<APIErrorResponse>(
        res,
        {
          success: false,
          content: null,
          errors: [getNotFoundError(userid)],
        },
        404
      );
    }
  } catch (err) {
    next(err);
  }
};

const getAllUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    const users = await userQueries.getAllUsersFromDB();

    return sendAPIResponse<APIUserListResponse>(res, {
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
      return sendAPIResponse<APIUserResponse>(res, {
        success: true,
        content: user,
      });
    } else {
      return sendAPIResponse<APIErrorResponse>(
        res,
        {
          success: false,
          content: null,
          errors: [getNotFoundError(`User ${req.params.id}`)],
        },
        404
      );
    }
  } catch (err) {
    next(err);
  }
};

const deleteUserFromDatabase: RequestHandler = async (req, res, next) => {
  try {
    const user = await userQueries.deleteUserFromDB(req.params.userid);

    if (user) {
      return sendAPIResponse<APIUserResponse>(res, {
        success: true,
        content: user,
      });
    } else {
      return sendAPIResponse<APIErrorResponse>(
        res,
        {
          success: false,
          content: null,
          errors: [getNotFoundError(`User ${req.params.id}`)],
        },
        404
      );
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
      ? sendAPIResponse<APIBlogListResponse>(res, {
          success: true,
          content: posts,
        })
      : sendAPIResponse<APIErrorResponse>(
          res,
          {
            success: false,
            content: null,
            errors: [getSimpleError("No user posts")],
          },
          400
        );
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
      ? sendAPIResponse<APIBlogListResponse>(res, {
          success: true,
          content: posts,
        })
      : sendAPIResponse<APIErrorResponse>(
          res,
          {
            success: false,
            content: null,
            errors: [getSimpleError("No user posts")],
          },
          400
        );
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

    console.log("post", post);

    return post
      ? sendAPIResponse<APIBlogResponse>(res, {
          success: true,
          content: post,
        })
      : sendAPIResponse<APIErrorResponse>(
          res,
          {
            success: false,
            content: null,
            errors: [getSimpleError("Could not add blog post to database.")],
          },
          500
        );
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

export const getAllUserPosts: RequestHandler[] = [
  verifyToken,
  // verifySameUser,
  getAllUserPostsFromDatabase,
];

export const postUserPost: RequestHandler[] = [
  verifyToken,
  verifySameUser,
  ...postValidators,
  postUserPostToDatabase,
];
