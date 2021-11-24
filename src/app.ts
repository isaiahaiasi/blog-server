// config imports
import { ALLOWED_ORIGINS, PORT } from "./config/secrets";
import express from "express";

// middleware imports
import cors from "cors";
import { catch404, errorHandler } from "./middleware/errorHandler";
import passport from "passport";
import {
  getAccessTokenStrategy,
  getLocalStrategy,
} from "./config/passportConfig";

// router imports
import authRouter from "./routes/auth";
import userRouter from "./routes/users";
import blogRouter from "./routes/blogs";
import commentRouter from "./routes/comments";
import initializeMongoose from "./config/mongoConfig";
import cookieParser from "cookie-parser";

const app = express();

// initialize mongoose for MongoDB connection
initializeMongoose();

// Global Middleware

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// auth middleware
passport.use(getLocalStrategy());
passport.use(getAccessTokenStrategy());
app.use(passport.initialize());

// ROUTES
app.route("/").get((req, res) => {
  res.send("This is not a valid endpoint.\n");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/comments", commentRouter);

app.use(catch404);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
