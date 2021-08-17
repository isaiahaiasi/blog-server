import { Types, Schema, model } from "mongoose";

export interface IComment {
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  // createdAt timestamp?
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  {
    timestamps: true,
  }
);

export default model<IComment>("Comment", commentSchema);
