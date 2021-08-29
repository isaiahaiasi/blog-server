import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  // TODO:
  // dateCreated
  // likedPosts
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default model<IUser>("User", userSchema);
