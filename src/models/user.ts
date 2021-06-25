import { Schema, model } from "mongoose";

interface IUser {
  username: string;
  password: string;
  // TODO:
  // dateCreated
  // ? posts
  // ? likedPosts
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default model<IUser>("User", userSchema);
