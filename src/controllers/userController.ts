import { RequestHandler } from "express";
import { Types } from "mongoose";
import Post from "../models/post";
import User from "../models/user";
import { verifyToken, verifySameUser } from "../middleware/authentication";

// * Controllers

const getAllUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find({}).select("username").exec().catch(next);
  res.json(users);
};

export const getUser: RequestHandler = async (req, res, next) => {
  const userId = Types.ObjectId(req.params.userid);
  console.log("logged in user:", req.user?.username);
  const user = await User.findById(userId, "username").exec().catch(next);
  res.json(user);
};

export const getUserPosts: RequestHandler = async (req, res, next) => {
  const userId = Types.ObjectId(req.params.userid);
  const posts = await Post.find({ author: userId }).exec().catch(next);
  res.json(posts);
};

// * Controller Arrays
// Group handler with middleware specific to it
// Can be exported and set as a request handler like individual handler
// Typical example:
//   - authentication middleware
//   - authorization middlware
//   - validation middleware
//   - route handler/response )
export const getUserVerified: RequestHandler[] = [
  verifyToken,
  verifySameUser,
  getUser,
];

export const getUsers: RequestHandler[] = [
  // verifyToken,
  getAllUsers,
];

export const putUser: RequestHandler[] = [];
