import express from "express";
import { postLogin } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/login", postLogin);

export default authRouter;
