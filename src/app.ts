import express, { Request, Response } from "express";

// config imports
import { PORT } from "./utils/secrets";

// middleware imports
import { catch404, errorHandler } from "./utils/errorHandler";

// router imports
import apiRouter from "./routes";

const app = express();

// TODO: set up global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// TODO: set up routes

app.route("/").get((req: Request, res: Response): void => {
  res.send("Hello ts world!");
});

app.use("/api", apiRouter);

app.use(catch404);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
