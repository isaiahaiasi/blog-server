import request from "supertest";
import express from "express";
import { catch404, errorHandler } from "../../middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const validRoute = "/route-that-returns-valid-response";
const errorRoute = "/route-that-always-throws";
const errorBody = { status: 450, message: "uh oh!" };

app.use(validRoute, (req, res) => {
  res.json({ msg: "received" });
});

app.use(errorRoute, (req, res, next) => {
  next(errorBody);
});

app.use(catch404);
app.use(errorHandler);

describe("404 handling", () => {
  it("should not return 404 if route exists", async () => {
    const response = await request(app).get(validRoute);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ msg: "received" });
  });

  it("should return 404 if route does not exist", async () => {
    const response = await request(app).get("/some-random-route");
    expect(response.statusCode).toBe(404);
  });
});

describe("Error handling", () => {
  it("should return the error status passed by routeHandler", async () => {
    const response = await request(app)
      .get(errorRoute)
      .expect("Content-Type", /json/)
      .expect(450);
    expect(response.body).toStrictEqual({
      errors: [{ msg: errorBody.message }],
    });
  });
});
