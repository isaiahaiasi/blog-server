import { IUser } from "../models/User";

export interface LoginResponse {
  user: Partial<IUser>;
  token: string;
}

export interface RegistrationResponse {
  user: IUser;
  msg: string;
}
