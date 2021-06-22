import { RequestHandler } from "express";

const sendNotImplemented = (msg: string): RequestHandler => {
  return (req, res) => {
    res.json({ errors: [{ msg: "NOT IMPLEMENTED YET: " + msg }] });
  };
};

export default sendNotImplemented;
