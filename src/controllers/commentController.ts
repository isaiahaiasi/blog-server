import { RequestHandler } from "express";
import { verifySameUser, verifyToken } from "../middleware/authentication";
import { getNotFoundErrorResponse } from "../middleware/errorHandler";
import { commentValidators } from "../middleware/postValidators";
import Comment from "../models/Comment";
import { castObjectId } from "../utils/mongooseHelpers";

const deleteCommentFromDatabase: RequestHandler = async (req, res, next) => {
  const commentId = castObjectId(req.params.commentid);

  if (!commentId) {
    return next();
  }

  const comment = await Comment.findByIdAndDelete(commentId).catch(next);

  if (comment) {
    res.json(comment);
  } else {
    res.status(400).json(getNotFoundErrorResponse(req.params.commentid));
  }
};

export const deleteComment = [
  verifyToken,
  verifySameUser,
  ...commentValidators,
  deleteCommentFromDatabase,
];
