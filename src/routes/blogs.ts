import express from "express";
import {
  deleteBlog,
  getBlogById,
  getBlogs,
  getPostCommentsFromDatabase,
  postComment,
  updateBlog,
} from "../controllers/blogController";

const blogRouter = express.Router();

// Get preview content of all blogs
blogRouter.get("/", getBlogs);

// Create a new blog
// ! moved to /users/blog

// Get a specific blog
blogRouter.get("/:blogid", getBlogById);

// Update a specific blog
blogRouter.put("/:blogid", updateBlog);

// Delete a specific blog
blogRouter.delete("/:blogid", deleteBlog);

// COMMENTS
// (currently no plan to enable updating a comment or get a specific comment)
blogRouter.get("/:blogid/comments", getPostCommentsFromDatabase);

blogRouter.post("/:blogid/comments", postComment);

export default blogRouter;
