import { RequestHandler } from "express";
import { verifyToken } from "../middleware/authentication";
import { getNotFoundError } from "../middleware/errorHandler";
import commentQueries from "../queries/commentQueries";
import { APIErrorResponse } from "../responses/generalInterfaces";
import {
  APICommentResponse,
  sendAPIResponse,
} from "../responses/responseInterfaces";

const deleteCommentFromDBHandler: RequestHandler = async (req, res, next) => {
  try {
    const comment = await commentQueries.deleteCommentFromDB(
      req.params.commentid
    );

    if (comment) {
      return sendAPIResponse<APICommentResponse>(res, {
        success: true,
        content: comment,
      });
    } else {
      return sendAPIResponse<APIErrorResponse>(
        res,
        {
          success: false,
          content: null,
          errors: [getNotFoundError(req.params.commentid)],
        },
        404
      );
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
