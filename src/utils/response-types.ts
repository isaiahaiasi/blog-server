import { IUser } from "../models/User";

export interface LoginResponse {
  user: IUser;
  token: string;
}

export interface RegistrationResponse {
  user: IUser;
  msg: string;
}
