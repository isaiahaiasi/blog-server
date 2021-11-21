import { Response } from "express";
import { IUser } from "../models/User";

// The base response interfaces that others descend from
export interface BaseAPIResponse {
  // general result of the request
  // if request did not return an expected result
  // then this should be false
  // HOWEVER, ideally HTTP error code provides the first layer of information
  success: boolean;

  // the main body of the response
  // overridden in inherited response interfaces
  content: unknown;

  errors?: APIError[];
}

export interface APIErrorResponse extends BaseAPIResponse {
  success: false;
  content: null;
  errors: APIError[];
}

// a generic error response interface
// creating for consistency, but also might want to extend it...
export interface APIError {
  msg: string;
}

export interface LoginResponse extends SuccessfulAPIResponse {
  content: Partial<IUser>;
}

export interface RegistrationResponse extends SuccessfulAPIResponse {
  content: Partial<IUser>;
}

export function sendAPIResponse<T>(
  res: Response,
  body: T,
  responseCode = 200
): void {
  res.status(responseCode).json(body);
}

interface SuccessfulAPIResponse extends BaseAPIResponse {
  success: true;
}

export interface APIResponse<T> extends SuccessfulAPIResponse {
  content: T;
}
