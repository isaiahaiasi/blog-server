import express from "express";
import { getBlogById, getBlogs, postBlog } from "../controllers/blogController";
import sendNotImplemented from "../utils/tempControllers";

const blogRouter = express.Router();

// Get preview content of all blogs
blogRouter.get("/", getBlogs);

// Create a new blog
blogRouter.post("/", postBlog);

// Get a specific blog
blogRouter.get("/:blogid", getBlogById);

// Update a specific blog
blogRouter.put("/:blogid", sendNotImplemented("PUT /blog/:blogid"));

// Delete a specific blog
blogRouter.delete("/:blogid", sendNotImplemented("DELETE /blog/:blogid"));

// COMMENTS
// (currently, do not plan to enable updating a comment or get a specific comment)
blogRouter.get(
  "/:blogid/comment",
  sendNotImplemented("GET /blog/:blogid/comment")
);

blogRouter.post(
  "/:blogid/comment",
  sendNotImplemented("POST /blog/:blogid/comment")
);

blogRouter.delete(
  "/:blogid/comment/:commentid",
  sendNotImplemented("DELETE /blog/:blogid/comment/:commentid")
);

export default blogRouter;
