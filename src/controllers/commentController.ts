import { RequestHandler } from "express";
import { verifySameUser, verifyToken } from "../middleware/authentication";
import { getNotFoundErrorResponse } from "../middleware/errorHandler";
import commentQueries from "../queries/commentQueries";

const deleteCommentFromDBHandler: RequestHandler = async (req, res, next) => {
  try {
    const comment = await commentQueries.deleteCommentFromDB(
      req.params.commentid
    );

    if (comment) {
      res.json(comment);
    } else {
      res.status(400).json(getNotFoundErrorResponse(req.params.commentid));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteComment = [
  verifyToken,
  // TODO: implement *real* verifySameUser
  // verifySameUser,
  deleteCommentFromDBHandler,
];
