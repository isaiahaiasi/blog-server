import express from "express";
import { PORT } from "./utils/secrets";

const app = express();

// TODO: set up global middleware

// TODO: set up routes

app.route("/").get((req, res) => {
  res.send("Hello ts world!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
