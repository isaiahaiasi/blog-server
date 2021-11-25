import { RequestHandler } from "express";
import passport from "passport";
import {
  APIErrorResponse,
  sendAPIResponse,
} from "../responses/responseInterfaces";

// TODO: Don't know where this should actually go...
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      username: string;
      _id: string;
      iat: number;
    }
  }
}

export const verifyToken: RequestHandler = passport.authenticate("jwt", {
  session: false,
});

export const verifySameUserFactory = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryFn: (id: string) => Promise<any>,
  param: string,
  matchField: string
): RequestHandler => {
  return async (req, res, next) => {
    const targetID = req.params[param];

    if (!targetID) {
      sendAPIResponse<APIErrorResponse>(
        res,
        {
          success: false,
          content: null,
          errors: [
            {
              msg: `Could not find ID field ${param} on target resource.`,
            },
          ],
        },
        400
      );
    }

    const record = await queryFn(targetID).catch(next);

    return record[matchField].toString() === req.user?._id.toString()
      ? next()
      : sendAPIResponse<APIErrorResponse>(
          res,
          {
            success: false,
            content: null,
            errors: [{ msg: "User is not authorized to perform this action." }],
          },
          403
        );
  };
};
