// Basic setup that all route tests will need

import express, { Application } from "express";
import { catch404, errorHandler } from "../../middleware/errorHandler";

type initCallback = { (app: express.Application): void };

/**
 * Initializes a basic express app.
 *
 * @remarks
 * The callback thing is pretty ugly, I can't think of a more graceful way
 * to pass middleware in *before* the error-handling middleware.
 *
 * @param cb - After initialization, this callback is called so additional middleware can be added before final error-handling middleware
 * @returns the app object so requests can be called with it
 */
export default function initializeApp(cb: initCallback): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  cb(app);

  app.use(catch404);
  app.use(errorHandler);

  return app;
}
