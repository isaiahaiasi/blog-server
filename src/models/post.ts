import { Types, Schema, model } from "mongoose";

export interface IPost {
  title: string;
  content: string;
  author: Types.ObjectId;
  publishDate: Schema.Types.Date;
  // do I need to include createdAt timestamp here to access it?...
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publishDate: { type: Schema.Types.Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<IPost>("Post", postSchema);
