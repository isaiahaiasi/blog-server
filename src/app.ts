import express from "express";

// config imports
import { PORT } from "./utils/secrets";

// middleware imports
import cors from "cors";
import { catch404, errorHandler } from "./middleware/errorHandler";

// router imports
import apiRouter from "./routes";

const app = express();

// TODO: set up global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: set up routes

app.route("/").get((req, res) => {
  res.send("Hello ts guys!");
});

app.use("/api", apiRouter);

app.use(catch404);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
