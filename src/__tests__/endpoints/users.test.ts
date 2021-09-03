import request from "supertest";
import initializeMongooseTesting from "../__fixtures__/mongoConfigTesting";
import initializeApp from "../__fixtures__/appConfigTesting";
import userRouter from "../../routes/users";
import seedDatabase from "../__fixtures__/dbTestSeeding";

const cleanupFnPromise = initializeMongooseTesting();

const app = initializeApp((app) => {
  app.use("/users", userRouter);
});

beforeAll(async () => {
  await seedDatabase();
});

afterAll(async () => {
  const cleanupFn = await cleanupFnPromise;
  await cleanupFn(true);
});

describe("GET /users", () => {
  it("should return list of users without password property", async () => {
    const response = await request(app)
      .get("/users")
      .expect("Content-Type", /json/);
    expect(response.statusCode).toBe(200);
    expect(response.body[0].username).toBeDefined();
    expect(response.body[0].password).toBeUndefined();
  });
});

describe("POST /users", () => {
  it("happy path: should add user to database", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        username: "harrietta",
        password: "superStrongPasswordIGuess",
        passwordConfirm: "superStrongPasswordIGuess",
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.user.username).toBe("harrietta");
    expect(response.body.msg).toBe("Registration successful!");
  });

  it("should reject user if passwords don't match", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        username: "harrietta2",
        password: "notSoStrong",
        passwordConfirm: "password",
      })
      .expect("Content-Type", /json/);

    expect(response.statusCode).not.toBe(200);
    expect(response.body.errors.length).toBe(1);
  });

  it("should reject user if username already exists", async () => {
    const response = await request(app)
      .post("/users")
      .send({
        username: "harrietta",
        password: "notSoStrong",
        passwordConfirm: "notSoStrong",
      })
      .expect("Content-Type", /json/);

    expect(response.statusCode).not.toBe(200);
    expect(response.body.errors.length).toBe(1);
  });

  it.todo(
    "should reject on each individual validator?... that doesn't seem necessary"
  );
});

describe("PUT /users/:userid", () => {
  it.todo("happy path: should update user in database");
  it.todo("should reject if jwt is invalid/not present");
  it.todo("should reject if jwt is neither admin nor user being edited");
  it.todo("should reject if given invalid form data");
});

describe("DELETE /users/:userid", () => {
  it.todo("happy path: should delete user from database");
  it.todo("should reject if jwt is invalid/not present (extract test logic?)");
  it.todo("should reject if jwt is not 'authorized' (extract test logic?)");
});
