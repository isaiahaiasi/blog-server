import express from "express";
import { postRegister } from "../controllers/authController";
import {
  deleteUser,
  getUser,
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

// create a new user
// ? Idk if this should be in this router
userRouter.post("/", postRegister);

// get a specific user
userRouter.get("/:userid", getUserVerified);

// update a specific user
userRouter.put("/:userid", putUser);

// delete a specific user
userRouter.delete("/:userid", deleteUser);

// * USER RESOURCES

// get all blog posts from this user
userRouter.get("/:userid/blog", getUserPosts);

// post a blog post by this user
userRouter.post("/:userid/blog", postUserPost);

// get all liked posts from this user
userRouter.get("/:userid/liked", sendNotImplemented("GET /user/:userid/liked"));

// add a new liked post to this user
// ? not sure if this should have /:blogid ...
userRouter.post(
  "/:userid/liked",
  sendNotImplemented("POST /user/:userid/liked")
);

// remove a liked post from this user
userRouter.delete(
  "/:userid/liked/:blogid",
  sendNotImplemented("DELETE /user/:userid/liked/:blogid")
);

export default userRouter;
