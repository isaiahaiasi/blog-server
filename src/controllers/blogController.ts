import { RequestHandler } from "express";

import Post from "../models/post";

export const getBlogs: RequestHandler = async (req, res, next) => {
  console.log("getting blogs...");
  const posts = await Post.find({}).exec().catch(next);
  res.json(posts);
};

export const postBlog: RequestHandler = async (req, res, next) => {
  const { title, content } = req.body;

  const post = await new Post({ title, content }).save().catch(next);

  res.json(post);
};
