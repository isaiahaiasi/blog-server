import request from "supertest";
import { Application } from "express";
import { LoginResponse } from "../../responses/responseInterfaces";

// just register a user, log in, and return the user + jwt
// this is predicated on the db being established already
export default async function getAuthenticatedUser(
  app: Application,
  registerRoute: string,
  loginRoute: string
): Promise<LoginResponse> {
  await request(app).post(registerRoute).send({
    username: "test-user-1",
    password: "test-pw-1",
    passwordConfirm: "test-pw-1",
  });

  const loginRes = await request(app).post(loginRoute).send({
    username: "test-user-1",
    password: "test-pw-1",
  });

  console.log(loginRes);
  return loginRes.body as LoginResponse;
}
