import express from "express";
import {
  getProtected,
  postLogin,
  postRegister,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/login", postLogin);
authRouter.post("/register", postRegister);
authRouter.get("/protected", getProtected);

export default authRouter;
