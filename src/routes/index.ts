import express, { RequestHandler } from "express";

const apiRouter = express.Router();

const sendNotImplemented = (msg: string): RequestHandler => {
  return (req, res) => {
    res.send("NOT IMPLEMENTED YET: " + msg + "\n");
  };
};

// LOGIN/LOGOUT/REGISTER
apiRouter.post("/login", sendNotImplemented("POST /login"));
apiRouter.post("/logout", sendNotImplemented("POST /logout"));
apiRouter.post("/register", sendNotImplemented("POST /register"));

// USER
apiRouter.post("/user", sendNotImplemented("POST /user"));

apiRouter.get("/user/:userid", sendNotImplemented("GET /user/:userid"));
apiRouter.put("/user/:userid", sendNotImplemented("PUT /user/:userid"));
apiRouter.delete("/user/:userid", sendNotImplemented("DELETE /user/:userid"));

// BLOG
apiRouter.get(
  "/user/:userid/blog",
  sendNotImplemented("GET /user/:userid/blog")
);
apiRouter.post(
  "/user/:userid/blog",
  sendNotImplemented("POST /user/:userid/blog")
);

apiRouter.get(
  "/user/:userid/blog/:blogid",
  sendNotImplemented("GET /user/:userid/blog/:blogid")
);
apiRouter.put(
  "/user/:userid/blog/:blogid",
  sendNotImplemented("PUT /user/:userid/blog/:blogid")
);
apiRouter.delete(
  "/user/:userid/blog/:blogid",
  sendNotImplemented("DELETE /user/:userid/blog/:blogid")
);

// COMMENT
apiRouter.post(
  "/user/:userid/blog/:blogid/comment",
  sendNotImplemented("POST /user/:userid/blog/:blogid/comment")
);

apiRouter.delete(
  "/user/:userid/blog/:blogid/comment/:commentid",
  sendNotImplemented("DELETE /user/:userid/blog/:blogid/comment/:commentid")
);

// LIKED POST
apiRouter.get(
  "/user/:userid/liked",
  sendNotImplemented("GET /user/:userid/liked")
);
apiRouter.post(
  "/user/:userid/liked",
  sendNotImplemented("POST /user/:userid/liked")
);

apiRouter.get(
  "/user/:userid/liked/:blogid",
  sendNotImplemented("GET /user/:userid/liked/:blogid")
);
apiRouter.delete(
  "/user/:userid/liked/:blogid",
  sendNotImplemented("DELETE /user/:userid/liked/:blogid")
);

export default apiRouter;
