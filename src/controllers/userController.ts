import { RequestHandler } from "express";
import { Types } from "mongoose";
import { logHeaders, verifyToken } from "../middleware/authentication";
import Post from "../models/post";
import User from "../models/user";

const getAllUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find({}).select("username").exec().catch(next);
  res.json(users);
};

export const getUser: RequestHandler = async (req, res, next) => {
  const userId = Types.ObjectId(req.params.userid);
  const user = await User.findById(userId, "username").exec().catch(next);
  res.json(user);
};

export const getUserPosts: RequestHandler = async (req, res, next) => {
  const userId = Types.ObjectId(req.params.userid);
  const posts = await Post.find({ author: userId }).exec().catch(next);
  res.json(posts);
};

export const getUsers: RequestHandler[] = [
  // logHeaders,
  // verifyToken,
  getAllUsers,
];
