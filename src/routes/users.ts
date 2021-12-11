import express from "express";
import { postRegister } from "../controllers/authController";
import {
  deleteUser,
  getAllUserPosts,
  getUserPosts,
  getUsers,
  getUserVerified,
  postUserPost,
  patchUser,
} from "../controllers/userController";
import sendNotImplemented from "../controllers/notImplementedController";

const userRouter = express.Router();

// * USER

// get list of all users
userRouter.get("/", getUsers);

// create/get/update/delete a user
userRouter.post("/", postRegister);
userRouter.get("/:userid", getUserVerified);
userRouter.patch("/:userid", patchUser);
userRouter.delete("/:userid", deleteUser);

// * USER RESOURCES

// get ALL blog posts from this user
// TODO: instead of separate route, handle via query string & route handler handler
userRouter.get("/:userid/blogs-all", getAllUserPosts);

// get all published blog posts from this user
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
