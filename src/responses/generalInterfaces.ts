// The base response interfaces that others descend from

export interface GenericAPIResponse {
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

export interface APIErrorResponse extends GenericAPIResponse {
  success: false;
  content: null;
  errors: APIError[];
}

// a generic error response interface
// creating for consistency, but also might want to extend it...
export interface APIError {
  msg: string;
}
