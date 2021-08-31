import express from "express";
import { postRegister } from "../controllers/authController";
import {
  deleteUser,
  getUserPosts,
  getUsers,
  getUserVerified,
  postUserPost,
  putUser,
} from "../controllers/userController";
import sendNotImplemented from "../utils/tempControllers";

const userRouter = express.Router();

// * USER

// get list of all users
userRouter.get("/", getUsers);

// create/get/update/delete a user
userRouter.post("/", postRegister);
userRouter.get("/:userid", getUserVerified);
userRouter.put("/:userid", putUser);
userRouter.delete("/:userid", deleteUser);

// * USER RESOURCES

// get all blog posts from this user
userRouter.get("/:userid/blogs", getUserPosts);

// post a blog post by this user
userRouter.post("/:userid/blogs", postUserPost);

// TODO: "likes" routes

// get all liked posts from this user
userRouter.get(
  "/:userid/likes",
  sendNotImplemented("GET /users/:userid/likes")
);

// add a new liked post to this user
// ? not sure if this should have /:blogid ...
userRouter.post(
  "/:userid/likes",
  sendNotImplemented("POST /users/:userid/likes")
);

// remove a liked post from this user
userRouter.delete(
  "/:userid/likes/:blogid",
  sendNotImplemented("DELETE /user/:userid/likes/:blogid")
);

export default userRouter;