import { RequestHandler } from "express";
import { verifySameUser, verifyToken } from "../middleware/authentication";
import { getNotFoundErrorResponse } from "../middleware/errorHandler";
import Comment, { IComment } from "../models/Comment";
import { castObjectId } from "../utils/mongooseHelpers";

//! DB
interface DeleteCommentFromDB {
  (commentId: string): Promise<IComment | null>;
}

// ! I don't think I like this pattern of using the return
// It kind of violates Command-Query-Separation principle
// ! I'm also not sure what the best way to handle validation is,
// because I don't necessarily want to make multiple db queries,
// but also feel like authorization should be it's own link in mw chain.
const deleteCommentFromMongoDB: DeleteCommentFromDB = async (id) => {
  const commentId = castObjectId(id);

  if (!commentId) {
    return commentId;
  }

  return await Comment.findByIdAndDelete(commentId);
};

// This, way, I can theoretically just swap out this value
// with whatever implementation I want.
const deleteCommentFromDB = deleteCommentFromMongoDB;

const deleteCommentFromDBHandler: RequestHandler = async (req, res, next) => {
  try {
    const comment = await deleteCommentFromDB(req.params.commentid);

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
