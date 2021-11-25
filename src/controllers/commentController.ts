import { RequestHandler } from "express";
import {
  verifyToken,
  verifyUserIsCommentAuthor,
} from "../middleware/authentication";
import { IComment } from "../models/Comment";
import commentQueries from "../queries/commentQueries";
import { sendAPIResponse, sendError } from "../responses/responseFactories";
import { APIResponse } from "../responses/responseInterfaces";

const deleteCommentFromDBHandler: RequestHandler = async (req, res, next) => {
  try {
    const comment = await commentQueries.deleteCommentFromDB(
      req.params.commentid
    );

    if (comment) {
      return sendAPIResponse<APIResponse<IComment>>(res, {
        success: true,
        content: comment,
      });
    } else {
      return sendError(res, `${req.params.commentid} not found.`, 404);
    }
  } catch (err) {
    next(err);
  }
};

export const deleteComment = [
  verifyToken,
  verifyUserIsCommentAuthor(),
  deleteCommentFromDBHandler,
];
