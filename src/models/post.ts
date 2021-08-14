import { Schema, model } from "mongoose";

interface Post {
  title: string;
  content: string;
  // author: Schema.Types.ObjectId;
  // publishedAt: Schema.Types.Date;
  // do I need to include createdAt timestamp here to access it?...
}

const postSchema = new Schema<Post>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // publishedAt: { type: Schema.Types.Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<Post>("Post", postSchema);
