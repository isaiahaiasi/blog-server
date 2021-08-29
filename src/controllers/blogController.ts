import { RequestHandler } from "express";
import { verifyToken } from "../middleware/authentication";
import {
  getSimpleErrorResponse,
  getNotFoundErrorResponse,
} from "../middleware/errorHandler";
import Post, { IPost } from "../models/Post";
import { castObjectId } from "../utils/mongooseHelpers";
import {
  commentValidators,
  postValidators,
} from "../middleware/postValidators";
import createDebug from "debug";
import commentQueries from "../db-queries/commentQueries";

const debug = createDebug("app:endpoints");

export const getBlogs: RequestHandler = async (req, res, next) => {
  debug("getting blogs...");
  const posts = await Post.find({})
    .sort({ publishDate: -1 })
    .populate("author", "-password")
    .exec()
    .catch(next);
  res.json(posts);
};

export const getBlogById: RequestHandler = async (req, res, next) => {
  debug(`Getting blog ${req.params.blogid}`);

  const blogId = castObjectId(req.params.blogid);

  if (!blogId) {
    return next();
  }

  const post = await Post.findById(blogId)
    .populate("author", "-password")
    .exec()
    .catch(next);

  res.json(post);
};

const updateBlogInDatabase: RequestHandler = async (req, res, next) => {
  const blogId = castObjectId(req.params.blogid);

  if (!blogId) {
    return next();
  }

  // Hacky way to only add property if not null/undefined
  const { title, content, publishDate } = req.body;
  const postUpdate: Partial<IPost> = {
    ...(title != null && { title }),
    ...(content != null && { content }),
    ...(publishDate != null && { publishDate }),
  };

  const updatedPost = await Post.findByIdAndUpdate(blogId, postUpdate).catch(
    next
  );

  return updatedPost
    ? res.json(updatedPost)
    : res
        .status(400)
        .json(getNotFoundErrorResponse(`Blog id: ${req.params.blogid}`));
};

const deleteBlogInDatabase: RequestHandler = async (req, res, next) => {
  const blogId = castObjectId(req.params.blogid);

  if (!blogId) {
    return next();
  }

  const deletedPost = await Post.findByIdAndDelete(blogId).catch(next);

  return deletedPost
    ? res.json(deletedPost)
    : res
        .status(400)
        .json(getNotFoundErrorResponse(`Blog id: ${req.params.blogid}`));
};

// * blog resources (ie, comments)

const getBlogCommentsFromDBHandler: RequestHandler = async (req, res, next) => {
  // TODO: maybe confirm blog actually exists?

  try {
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
    const post = await Post.findById(blogId).exec();

    if (!post) {
      res.status(400).json(getNotFoundErrorResponse(req.params.blogid));
      return;
    }

    debug(`Posting comment on blogpost ${blogId}`);

    const comment = await commentQueries.postCommentToDB({
      content: req.body.content,
      author: userId,
      post: post._id,
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
