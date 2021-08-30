import request from "supertest";
import express from "express";
import { RequestHandler } from "express-serve-static-core";

// TODO: create minimal model of app
const app = express();

const testResponse = { msg: "hello" };
const testHandler: RequestHandler = (req, res) => {
  res.json(testResponse);
};

// TODO: mock db & hook up to app
// (which should be relatively easy)

// TODO: create mock data for testing
// const blogListMock: IPost[] = [];

app.use("/", testHandler);

describe("Basic responsivity", () => {
  it("should respond w json", async () => {
    const route = "/";
    const response = await request(app).get(route);
    expect(response.body).toEqual(testResponse);
    expect(response.statusCode).toBe(200);
  });
});
