// config imports
import { PORT } from "./utils/secrets";
import express from "express";

// middleware imports
import cors from "cors";
import { catch404, errorHandler } from "./middleware/errorHandler";
import passport from "passport";
import { getJwt, getLocal } from "./config/passportConfig";

// router imports
import authRouter from "./routes/auth";
import userRouter from "./routes/users";
import blogRouter from "./routes/blogs";
import commentRouter from "./routes/comments";
import initializeMongoose from "./mongoConfig";

const app = express();

// initialize mongoose for MongoDB connection
initializeMongoose();

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
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/comments", commentRouter);

app.use(catch404);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
