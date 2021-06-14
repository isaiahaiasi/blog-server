import express, { RequestHandler } from "express";

const apiRouter = express.Router();

const sendNotImplemented = (msg: string): RequestHandler => {
  return (req, res) => {
    res.send("NOT IMPLEMENTED YET: " + msg);
  };
};

// LOGIN/LOGOUT/REGISTER
apiRouter.post("/login", sendNotImplemented("POST /login\n"));
apiRouter.post("/logout", sendNotImplemented("POST /logout\n"));
apiRouter.post("/register", sendNotImplemented("POST /register\n"));

// USER
apiRouter.post("/user", sendNotImplemented("POST /user\n"));

apiRouter.get("/user/:userid", sendNotImplemented("GET /user/:userid\n"));
apiRouter.put("/user/:userid", sendNotImplemented("PUT /user/:userid\n"));
apiRouter.delete("/user/:userid", sendNotImplemented("DELETE /user/:userid\n"));

// BLOG
apiRouter.get(
  "/user/:userid/blog",
  sendNotImplemented("GET /user/:userid/blog\n")
);
apiRouter.post(
  "/user/:userid/blog",
  sendNotImplemented("POST /user/:userid/blog\n")
);

apiRouter.get(
  "/user/:userid/blog/:blogid",
  sendNotImplemented("GET /user/:userid/blog/:blogid\n")
);
apiRouter.put(
  "/user/:userid/blog/:blogid",
  sendNotImplemented("PUT /user/:userid/blog/:blogid\n")
);
apiRouter.delete(
  "/user/:userid/blog/:blogid",
  sendNotImplemented("DELETE /user/:userid/blog/:blogid\n")
);

// COMMENT
apiRouter.post(
  "/user/:userid/blog/:blogid/comment",
  sendNotImplemented("POST /user/:userid/blog/:blogid/comment\n")
);

apiRouter.delete(
  "/user/:userid/blog/:blogid/comment/:commentid",
  sendNotImplemented("DELETE /user/:userid/blog/:blogid/comment/:commentid\n")
);

// LIKED POST
apiRouter.get(
  "/user/:userid/liked",
  sendNotImplemented("GET /user/:userid/liked\n")
);
apiRouter.post(
  "/user/:userid/liked",
  sendNotImplemented("POST /user/:userid/liked\n")
);

apiRouter.get(
  "/user/:userid/liked/:blogid",
  sendNotImplemented("GET /user/:userid/liked/:blogid\n")
);
apiRouter.delete(
  "/user/:userid/liked/:blogid",
  sendNotImplemented("DELETE /user/:userid/liked/:blogid\n")
);

export default apiRouter;
