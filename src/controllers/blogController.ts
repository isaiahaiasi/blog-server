import { RequestHandler } from "express";
import { verifyToken } from "../middleware/authentication";
import { getNotFoundErrorResponse } from "../middleware/errorHandler";
import Comment from "../models/Comment";
import Post, { IPost } from "../models/Post";
import { castObjectId } from "../utils/mongooseHelpers";
import { postValidators } from "../middleware/postValidators";
import createDebug from "debug";

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

export const getPostCommentsFromDatabase: RequestHandler = async (
  req,
  res,
  next
) => {
  const blogId = castObjectId(req.params.blogid);

  if (!blogId) {
    return next();
  }

  const comments = await Comment.find({ post: blogId })
    .populate("author", "-password")
    .exec()
    .catch(next);

  if (comments) {
    res.json(comments);
  } else {
    res
      .status(400)
      .json(
        getNotFoundErrorResponse(`Comments for blog id: ${req.params.blogid}`)
      );
  }
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

const postCommentToDatabase: RequestHandler = async (req, res, next) => {
  const blogId = castObjectId(req.params.blogid);

  if (!blogId) {
    return next();
  }

  const post = await Post.findById(blogId).exec().catch(next);

  if (post) {
    const { content } = req.body;
    const postId = post._id;
    const author = req.user?._id;
    const comment = await new Comment({ content, author, post: postId })
      .save()
      .catch(next);
    res.json(comment);
  } else {
    res.status(400).json(getNotFoundErrorResponse(req.params.blogid));
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
  ...postValidators,
  postCommentToDatabase,
];
