// interfaces for the API endpoint responses

import { Response } from "express";
import { IComment } from "../models/Comment";
import { IPost } from "../models/Post";
import { IUser } from "../models/User";
import { APIResponse } from "./generalInterfaces";

// TODO: some APIResponseFactory to implement these interfaces
// (I'm not 100% sure how I want to handle this,
// since ultimately I'm passing the response to a non-typesafe function)
export function sendAPIResponse<T>(
  res: Response,
  body: T,
  responseCode = 200
): void {
  res.status(responseCode).json(body);
}

interface SuccessfulAPIResponse extends APIResponse {
  success: true;
}

export interface APIBlogResponse extends SuccessfulAPIResponse {
  content: IPost | null;
}

export interface APIBlogListResponse extends SuccessfulAPIResponse {
  content: IPost[] | null;
}

export interface APICommentResponse extends SuccessfulAPIResponse {
  content: IComment | null;
}

export interface APICommentListResponse extends SuccessfulAPIResponse {
  content: IComment[] | null;
}

export interface APIUserResponse extends SuccessfulAPIResponse {
  content: IUser | null;
}

export interface APIUserListResponse extends SuccessfulAPIResponse {
  content: IUser[] | null;
}
