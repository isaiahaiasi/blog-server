import { Schema, model } from "mongoose";

interface User {
  username: string;
  password: string;
  // TODO:
  // dateCreated
  // ? posts
  // ? likedPosts
}

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default model<User>("User", userSchema);
