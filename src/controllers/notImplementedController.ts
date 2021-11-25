import { RequestHandler } from "express";
import { sendError } from "../responses/responseFactories";

const sendNotImplemented = (msg: string): RequestHandler => {
  return (req, res) => {
    sendError(res, `NOT IMPLEMENTED: ${msg}`, 501);
  };
};

export default sendNotImplemented;
