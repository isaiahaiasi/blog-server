import express from "express";
import { deleteComment } from "../controllers/commentController";

const commentRouter = express.Router();

commentRouter.delete("/:commentid", deleteComment);

export default commentRouter;
