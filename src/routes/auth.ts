import express from "express";
import { postLogin, postRegister } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/login", postLogin);
authRouter.post("/register", postRegister);

export default authRouter;
