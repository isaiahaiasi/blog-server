// interfaces for the API endpoint responses

import { Response } from "express";
import { GenericAPIResponse } from "./generalInterfaces";

export function sendAPIResponse<T>(
  res: Response,
  body: T,
  responseCode = 200
): void {
  res.status(responseCode).json(body);
}

interface SuccessfulAPIResponse extends GenericAPIResponse {
  success: true;
}

export interface APIResponse<T> extends SuccessfulAPIResponse {
  content: T | null;
}
