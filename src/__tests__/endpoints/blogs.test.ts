import request from "supertest";
import blogRouter from "../../routes/blogs";
import initializeMongooseTesting from "../__fixtures__/mongoConfigTesting";
import initializeApp from "../__fixtures__/appConfigTesting";
import seedDatabase from "../__fixtures__/dbTestSeeding";

const cleanupFnPromise = initializeMongooseTesting();

// TODO: connect auth to test authenticated routes

const app = initializeApp((app) => {
  app.use("/blogs", blogRouter);
});

// * Set up and teardown for testing

beforeAll(async () => {
  await seedDatabase();
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
    console.log(response.body);
  });
});
