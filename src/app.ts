// config imports
import { PORT, MONGODB_URI } from "./utils/secrets";
import express from "express";
import mongoose from "mongoose";

// middleware imports
import cors from "cors";
import { catch404, errorHandler } from "./middleware/errorHandler";
import passport from "passport";
import { getJwt, getLocal } from "./config/passportConfig";

// router imports
import apiRouter from "./routes";
import userRouter from "./routes/user";
import blogRouter from "./routes/blog";
import authRouter from "./routes/auth";
import commentRouter from "./routes/comment";

const app = express();

// Set up Mongoose (TODO?: Extract)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Global Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auth middleware
passport.use(getLocal());
passport.use(getJwt());
app.use(passport.initialize());
// ROUTES

app.route("/").get((req, res) => {
  res.send("Hello ts guys!");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api/comment", commentRouter);
app.use("/api", apiRouter);

app.use(catch404);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
