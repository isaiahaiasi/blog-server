import { Schema, model } from "mongoose";

interface Post {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  comments: Schema.Types.ObjectId[]; // ? required vs optional?
  publishedAt: Schema.Types.Date; // ? vs vanilla Date?
  // do I need to include createdAt timestamp here to access it?...
}

const postSchema = new Schema<Post>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publishedat: { type: Schema.Types.Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<Post>("Post", postSchema);
