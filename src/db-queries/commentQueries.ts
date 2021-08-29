import Comment, { IComment } from "../models/Comment";
import { castObjectId } from "../utils/mongooseHelpers";

// * Query Interfaces
interface CommentQueries {
  postCommentToDB: { (comment: IComment): Promise<IComment | null> };
  deleteCommentFromDB: { (commentId: string): Promise<IComment | null> };
  getCommentsByBlogId: { (blogId: string): Promise<IComment[]> };
}

// * Query Implementations

// ! I don't know if I like this pattern of using the return
// It kind of violates Command-Query-Separation principle
// Torn between "don't return null"/CQS vs. "Exceptions should be Exceptional"
// I need to `catch` anyway, so I might as well throw an error instead of null, right?
// ! I'm also not sure what the best way to handle validation is,
// because I don't necessarily want to make multiple db queries,
// but also feel like authorization should be it's own link in mw chain.

const mongoQueries: CommentQueries = {
  postCommentToDB: async (comment) => {
    return new Comment(comment).save();
  },

  deleteCommentFromDB: async (id) => {
    const commentId = castObjectId(id);

    if (!commentId) {
      return commentId;
    }

    return await Comment.findByIdAndDelete(commentId);
  },

  getCommentsByBlogId: async (id) => {
    // This checking *should* already be handled
    // but I should find a better way to organize this
    const blogId = castObjectId(id);

    if (!blogId) {
      return [];
    }

    return Comment.find({ post: blogId })
      .populate("author", "-password")
      .sort({ createdAt: -1 })
      .exec();
  },
};

// * Export desired implementation
export default mongoQueries;
