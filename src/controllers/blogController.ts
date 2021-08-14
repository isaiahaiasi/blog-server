import { RequestHandler } from "express";
import { Types } from "mongoose";

import Post from "../models/post";

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

export const postBlog: RequestHandler = async (req, res, next) => {
  const { title, content, authorId } = req.body;

  const post = await new Post({
    title,
    content,
    author: Types.ObjectId(authorId),
  })
    .save()
    .catch(next);

  res.json(post);
};
