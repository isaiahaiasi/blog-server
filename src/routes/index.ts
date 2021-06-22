import express from "express";

import sendNotImplemented from "../utils/tempControllers";

const apiRouter = express.Router();

// LOGIN/LOGOUT/REGISTER
apiRouter.post("/login", sendNotImplemented("POST /login"));
apiRouter.post("/logout", sendNotImplemented("POST /logout"));
apiRouter.post("/register", sendNotImplemented("POST /register"));

export default apiRouter;
