import { RequestHandler } from "express";
import { verifyToken } from "../middleware/authentication";
import {
  getSimpleErrorResponse,
  getNotFoundErrorResponse,
} from "../middleware/errorHandler";
import { IPost } from "../models/Post";
import { castObjectId } from "../utils/mongooseHelpers";
import {
  commentValidators,
  postValidators,
} from "../middleware/postValidators";
import createDebug from "debug";
import commentQueries from "../queries/commentQueries";
import blogQueries from "../queries/blogQueries";

const debug = createDebug("app:endpoints");

export const getBlogs: RequestHandler = async (req, res, next) => {
  debug("getting blogs...");

  try {
    const posts = await blogQueries.getAllBlogsFromDB();
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

const getBlogByIdHandler: RequestHandler = async (req, res, next) => {
  debug(`Getting blog ${req.params.blogid}`);

  try {
    const post = await blogQueries.getBlogFromDBById(req.params.blogid);

    if (post) {
      res.json(post);
      return;
    } else {
      res
        .status(400)
        .json(getNotFoundErrorResponse(`Blog post id#${req.params.id}`));
      return;
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
    const post = await blogQueries.updateBlogInDB(req.params.id, postUpdate);
    if (post) {
      res.json(post);
      return;
    } else {
      res
        .status(400)
        .json(getNotFoundErrorResponse(`Blog id: ${req.params.blogid}`));
    }
  } catch (err) {
    next(err);
  }
};

const deleteBlogInDatabase: RequestHandler = async (req, res, next) => {
  try {
    const deletedPost = await blogQueries.deleteBlogFromDB(req.params.id);

    return deletedPost
      ? res.json(deletedPost)
      : res
          .status(400)
          .json(getNotFoundErrorResponse(`Blog id: ${req.params.blogid}`));
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
      res.json(comments);
    } else {
      res
        .status(400)
        .json(
          getNotFoundErrorResponse(`Comments for blog id: ${req.params.blogid}`)
        );
    }
  } catch (err) {
    next(err);
  }
};

// TODO: simplify?
const postCommentToDBHandler: RequestHandler = async (req, res, next) => {
  const blogId = castObjectId(req.params.blogid);
  const userId = castObjectId(req.user?._id ?? "");

  if (!blogId) {
    return res
      .status(400)
      .json(getSimpleErrorResponse(`Invalid blog id ${req.params.blogid}`));
  }

  if (!userId) {
    return res
      .status(401)
      .json(getSimpleErrorResponse("Invalid user credentials."));
  }

  try {
    const post = await blogQueries.getBlogFromDBById(req.params.id);

    if (!post) {
      res.status(400).json(getNotFoundErrorResponse(req.params.blogid));
      return;
    }

    debug(`Posting comment on blogpost ${blogId}`);

    const comment = await commentQueries.postCommentToDB({
      content: req.body.content,
      author: userId,
      post: blogId,
    });

    if (!comment) {
      res.status(500).json(getSimpleErrorResponse("Could not post comment."));
    }

    res.json(comment);
  } catch (err) {
    return next(err);
  }
};

//* Controller arrays

export const getBlogById: RequestHandler[] = [getBlogByIdHandler];

export const updateBlog: RequestHandler[] = [
  verifyToken,
  // TODO: confirm logged in user matches author of post
  ...postValidators,
  updateBlogInDatabase,
];

export const deleteBlog: RequestHandler[] = [
  verifyToken,
  // TODO: authorization
  ...postValidators,
  deleteBlogInDatabase,
];

export const postComment: RequestHandler[] = [
  verifyToken,
  // TODO: authorization
  ...commentValidators,
  postCommentToDBHandler,
];

export const getBlogComments: RequestHandler[] = [getBlogCommentsFromDBHandler];
