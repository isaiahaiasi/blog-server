import express from "express";
import {
  deleteBlog,
  getBlogById,
  getBlogs,
  getPostCommentsFromDatabase,
  postComment,
  updateBlog,
} from "../controllers/blogController";
import { postUserPost } from "../controllers/userController";
import sendNotImplemented from "../utils/tempControllers";

const blogRouter = express.Router();

// Get preview content of all blogs
blogRouter.get("/", getBlogs);

// Create a new blog
// ! moved to user/blog - not sure which way to go on that...
// blogRouter.post("/", postBlog);

// Get a specific blog
blogRouter.get("/:blogid", getBlogById);

// Update a specific blog
blogRouter.put("/:blogid", updateBlog);

// Delete a specific blog
blogRouter.delete("/:blogid", deleteBlog);

// COMMENTS
// (currently, do not plan to enable updating a comment or get a specific comment)
blogRouter.get("/:blogid/comment", getPostCommentsFromDatabase);

blogRouter.post("/:blogid/comment", postComment);

export default blogRouter;
