import express from "express";
import mongoose from "mongoose";

// config imports
import { PORT, MONGODB_URI } from "./utils/secrets";

// middleware imports
import cors from "cors";
import { catch404, errorHandler } from "./middleware/errorHandler";

// router imports
import apiRouter from "./routes";
import userRouter from "./routes/user";
import blogRouter from "./routes/blog";

const app = express();

// Set up Mongoose (TODO?: Extract)
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// TODO: set up global middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES

app.route("/").get((req, res) => {
  res.send("Hello ts guys!");
});

app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
app.use("/api", apiRouter);

app.use(catch404);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
