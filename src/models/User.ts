import { Schema, model, ObjectId } from "mongoose";

export interface IUser {
  _id?: ObjectId | string; // TODO: not sure how to type this
  username: string;
  password: string;
  tkey?: string;
  // TODO:
  // dateCreated
  // likedPosts
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  tkey: { type: String, required: true },
});

export default model<IUser>("User", userSchema);
