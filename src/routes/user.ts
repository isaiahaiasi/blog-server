import express from "express";
import { postRegister } from "../controllers/authController";
import { getUsers } from "../controllers/userController";
import sendNotImplemented from "../utils/tempControllers";

const userRouter = express.Router();

// * USER

// get list of all users
// ? s/ ??
userRouter.get("/", getUsers);

// create a new user
userRouter.post("/", postRegister); // ? Idk if this should be in this router...

// get a specific user
userRouter.get("/:userid", sendNotImplemented("GET /user/:userid"));

// update a specific user
userRouter.put("/:userid", sendNotImplemented("PUT /user/:userid"));

// delete a specific user
userRouter.delete("/:userid", sendNotImplemented("DELETE /user/:userid"));

// * USER RESOURCES

// get all blog posts from this user
userRouter.get("/:userid/blog", sendNotImplemented("GET /user/:userid/blog"));

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
