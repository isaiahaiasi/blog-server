import { RequestHandler } from "express";
import { Types } from "mongoose";
import { verifyToken } from "../middleware/authentication";
import { getNotFoundErrorResponse } from "../middleware/errorHandler";

import Post, { IPost } from "../models/post";

export const getBlogs: RequestHandler = async (req, res, next) => {
  console.log("getting blogs...");
  const posts = await Post.find({}).exec().catch(next);
  res.json(posts);
};

export const getBlogById: RequestHandler = async (req, res, next) => {
  console.log(`Getting blog ${req.params.blogid}`);

  const post = await Post.findById(Types.ObjectId(req.params.blogid))
    .exec()
    .catch(next);

  res.json(post);
};

const updateBlogInDatabase: RequestHandler = async (req, res, next) => {
  const blogId = Types.ObjectId(req.params.blogid);
  const { title, content, publishDate } = req.body;
  const postUpdate: Partial<IPost> = { title, content, publishDate };

  const updatedPost = Post.findByIdAndUpdate(blogId, postUpdate).catch(next);

  return updatedPost
    ? res.json(updatedPost)
    : res
        .status(400)
        .json(getNotFoundErrorResponse(`Blog id: ${req.params.blogid}`));
};

const deleteBlogInDatabase: RequestHandler = async (req, res, next) => {
  const blogId = Types.ObjectId(req.params.blogid);

  const deletedPost = Post.findByIdAndDelete(blogId).catch(next);

  return deletedPost
    ? res.json(deletedPost)
    : res
        .status(400)
        .json(getNotFoundErrorResponse(`Blog id: ${req.params.blogid}`));
};

// TODO:
//! Once comment model is implemented
// const postCommentInDatabase: RequestHandler = async (req, res, next) => {
//   const blogId = Types.ObjectId(req.params.blogid);
// }

const updateBlog: RequestHandler[] = [
  verifyToken,
  // TODO: confirm logged in user matches author of post
  // TODO: validate(/sanitize?) inputs:
  //    - Title
  //    - Content
  //    - PublishDate
  updateBlogInDatabase,
];

const deleteBlog: RequestHandler[] = [
  verifyToken,
  // TODO: confirm logged in user matches author of post
  deleteBlogInDatabase,
];

// TODO:
//! Once comment model is implemented
// const postComment: RequestHandler[] = [
//   verifyToken,
//   // TODO: validate(/sanitize?) inputs:
//   // - content
//   postCommentToDatabase
// ]
