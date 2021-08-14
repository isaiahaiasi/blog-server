import { RequestHandler } from "express";
import { Types } from "mongoose";
import { logHeaders, verifyToken } from "../middleware/authentication";
import User from "../models/user";

const getAllUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find({}).select("username").exec().catch(next);
  res.json(users);
};

const getUser: RequestHandler = async (req, res, next) => {
  const id = new Types.ObjectId(req.params.id);
  const user = await User.findById(id, "username").exec().catch(next);
  console.log(user);
  res.json(user);
};

export const getUsers: RequestHandler[] = [
  logHeaders,
  verifyToken,
  getAllUsers,
];
