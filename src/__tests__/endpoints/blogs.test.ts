import request from "supertest";
import express from "express";

import { catch404, errorHandler } from "../../middleware/errorHandler";
import blogRouter from "../../routes/blogs";
import initializeMongooseTesting from "../__fixtures__/mongoConfigTesting";

// * Set up mongodb-memory-server
// Unfortunately, can't await it in current set up,
// so this holds the Promise that resolves to the kill fn.
const cleanupFnPromise = initializeMongooseTesting();

// TODO: connect auth to test authenticated routes

// * Set up app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/blogs", blogRouter);

app.use(catch404);
app.use(errorHandler);

// * Set up and teardown for testing

beforeAll(async () => {
  // TODO: populate db
});

afterAll(async () => {
  const cleanupFn = await cleanupFnPromise;
  await cleanupFn(true);
});

// mongoose times out instead of immediately throwing,
// when it hasn't been set up yet...
describe("GET /blogs", () => {
  it("should return list of blogs.", async () => {
    const response = await request(app)
      .get("/blogs")
      .expect("Content-Type", /json/);
    expect(response.statusCode).toBe(200);
  });
});
