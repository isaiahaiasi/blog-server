import { RequestHandler } from "express";
import User from "../models/user";

const getAllUsers: RequestHandler = async (req, res, next) => {
  const users = await User.find({}).select("username").exec().catch(next);
  res.json(users);
};

export const getUsers: RequestHandler[] = [getAllUsers];
