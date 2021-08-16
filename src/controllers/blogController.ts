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
