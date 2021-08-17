import { RequestHandler } from "express";
import { Types } from "mongoose";
import { verifyToken } from "../middleware/authentication";
import { getNotFoundErrorResponse } from "../middleware/errorHandler";
import Comment from "../models/Comment";

const deleteCommentFromDatabase: RequestHandler = async (req, res, next) => {
  const commentId = Types.ObjectId(req.params.commentid);
  const comment = await Comment.findByIdAndDelete(commentId).catch(next);

  if (comment) {
    res.json(comment);
  } else {
    res.status(400).json(getNotFoundErrorResponse(req.params.commentid));
  }
};

export const deleteComment = [
  verifyToken,
  // TODO: authorize
  deleteCommentFromDatabase,
];
