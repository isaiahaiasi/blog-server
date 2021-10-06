// interfaces for the API endpoint responses

import { Response } from "express";
import { IComment } from "../models/Comment";
import { IPost } from "../models/Post";
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

// eg:
// GET blogs/:blogid
// PUT blogs/:blogid
// DELETE blogs/:blogid
// POST /users/:userid/blogs
export interface APIBlogResponse extends APIResponse {
  content: IPost | null;
}

// eg:
// GET /blogs
// GET /users/:userid/blogs
// GET /users/:userid/blogs-all
export interface APIBlogListResponse extends APIResponse {
  content: IPost[] | null;
}

// eg:
// POST /:blogid/comments
export interface APICommentResponse extends APIResponse {
  content: IComment | null;
}

// eg:
// GET /:blogid/comments
export interface APICommentListResponse extends APIResponse {
  content: IComment[] | null;
}
