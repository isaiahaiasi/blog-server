import { RequestHandler } from "express";
import {
  verifyToken,
  verifyUserIsBlogAuthor,
} from "../middleware/authentication";
import { getNotFoundError } from "../middleware/errorHandler";
import {
  commentValidators,
  postValidators,
} from "../middleware/postValidators";
import { IComment } from "../models/Comment";
import { IPost } from "../models/Post";
import blogQueries from "../queries/blogQueries";
import commentQueries from "../queries/commentQueries";
import { sendAPIResponse, sendError } from "../responses/responseFactories";
import { APIResponse } from "../responses/responseInterfaces";
import createLogger from "../utils/debugHelper";
import { castObjectId } from "../utils/mongooseHelpers";

const debug = createLogger("endpoints");

export const getBlogs: RequestHandler = async (req, res, next) => {
  debug("getting blogs...");

  try {
    const posts = await blogQueries.getAllBlogsFromDB(15);
    return sendAPIResponse<APIResponse<IPost[]>>(res, {
      success: true,
      content: posts,
    });
  } catch (err) {
    next(err);
  }
};

const getBlogByIdHandler: RequestHandler = async (req, res, next) => {
  debug(`Getting blog ${req.params.blogid}`);

  try {
    const post = await blogQueries.getBlogFromDBById(req.params.blogid);

    if (post) {
      return sendAPIResponse<APIResponse<IPost>>(res, {
        success: true,
        content: post,
      });
    } else {
      return sendAPIResponse(
        res,
        {
          success: false,
          content: null,
          errors: [getNotFoundError(`Blog post id#${req.params.id}`)],
        },
        404
      );
    }
  } catch (err) {
    next(err);
  }
};

const updateBlogInDatabase: RequestHandler = async (req, res, next) => {
  // Hacky way to only add property if not null/undefined
  const { title, content, publishDate } = req.body;
  const postUpdate: Partial<IPost> = {
    ...(title != null && { title }),
    ...(content != null && { content }),
    ...(publishDate != null && { publishDate }),
  };

  try {
    const post = await blogQueries.updateBlogInDB(
      req.params.blogid,
      postUpdate
    );
    if (post) {
      return sendAPIResponse<APIResponse<IPost>>(res, {
        success: true,
        content: { ...post, ...postUpdate },
      });
    } else {
      return sendError(res, `Blog id: ${req.params.blogid}`, 404);
    }
  } catch (err) {
    next(err);
  }
};

const deleteBlogInDatabase: RequestHandler = async (req, res, next) => {
  try {
    const deletedPost = await blogQueries.deleteBlogFromDB(req.params.blogid);

    return deletedPost
      ? sendAPIResponse<APIResponse<IPost>>(res, {
          success: true,
          content: deletedPost,
        })
      : sendError(res, `Blog id: ${req.params.blogid}`, 404);
  } catch (err) {
    next(err);
  }
};

// * blog resources (ie, comments)

const getBlogCommentsFromDBHandler: RequestHandler = async (req, res, next) => {
  try {
    // TODO: maybe confirm blog actually exists?
    debug(`Retrieving comments for post ${req.params.blogid}`);
    const comments = await commentQueries.getCommentsByBlogId(
      req.params.blogid
    );

    if (comments) {
      return sendAPIResponse<APIResponse<IComment[]>>(res, {
        success: true,
        content: comments,
      });
    } else {
      return sendError(res, `Blog id ${req.params.blogid}`, 404);
    }
  } catch (err) {
    next(err);
  }
};

const postCommentToDBHandler: RequestHandler = async (req, res, next) => {
  const blogId = castObjectId(req.params.blogid);
  const userId = castObjectId(req.user?._id ?? "");

  if (!blogId) {
    return sendError(res, `Invalid blog id ${req.params.blogid}`, 400);
  }

  if (!userId) {
    return sendError(res, "Invalid user credentials.", 401);
  }

  try {
    const post = await blogQueries.getBlogFromDBById(req.params.blogid);

    console.log("post", post);
    if (!post) {
      return sendError(res, `Could not find ${req.params.blogid}`, 404);
    }

    debug(`Posting comment on blogpost ${blogId}`);

    const comment = await commentQueries.postCommentToDB({
      content: req.body.content,
      author: userId,
      post: blogId,
    });

    if (!comment) {
      return sendError(res, "Could not post comment.", 500);
    }

    sendAPIResponse<APIResponse<IComment>>(res, {
      success: true,
      content: comment,
    });
  } catch (err) {
    return next(err);
  }
};

//* Controller arrays

export const getBlogById: RequestHandler[] = [getBlogByIdHandler];

export const updateBlog: RequestHandler[] = [
  verifyToken,
  verifyUserIsBlogAuthor(),
  ...postValidators,
  updateBlogInDatabase,
];

export const deleteBlog: RequestHandler[] = [
  verifyToken,
  verifyUserIsBlogAuthor(),
  // ...postValidators,
  deleteBlogInDatabase,
];

export const postComment: RequestHandler[] = [
  ...commentValidators,
  verifyToken,
  postCommentToDBHandler,
];

export const getBlogComments: RequestHandler[] = [getBlogCommentsFromDBHandler];
