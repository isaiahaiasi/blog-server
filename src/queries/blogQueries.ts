import Post, { IPost } from "../models/Post";
import { castObjectId } from "../utils/mongooseHelpers";

interface BlogQueries {
  getAllBlogsFromDB: { (maxResults: number): Promise<IPost[]> };
  getBlogFromDBById: { (id: string): Promise<IPost | null> };
  getRawBlogFromDB: { (id: string): Promise<IPost | null> };
  getPublishedUserBlogsFromDB: { (userId: string): Promise<IPost[] | null> };
  getAllUserBlogsFromDB: { (userId: string): Promise<IPost[] | null> };
  updateBlogInDB: { (id: string, blog: Partial<IPost>): Promise<IPost | null> };
  deleteBlogFromDB: { (id: string): Promise<IPost | null> };
  addBlogToDB: { (blog: IPostStringy): Promise<IPost | null> };
}

// Override IPost type to replace author's ObjectId type with string
// (Might need to formalize this string vs ObjectId pattern, b/c this is silly,
// but this is the only place this has actually been necessary so far)
type IPostStringy = Omit<IPost, "author"> & { author: string };

const mongoQueries: BlogQueries = {
  getAllBlogsFromDB: async (maxResults: number) => {
    const currentDate = new Date();
    return Post.find({
      publishDate: { $lte: currentDate },
    })
      .sort({ publishDate: -1 })
      .limit(maxResults)
      .populate("author", "-password -tkey")
      .exec();
  },

  getBlogFromDBById: async (id) => {
    const blogId = castObjectId(id);

    if (!blogId) {
      return null;
    }

    return Post.findById(blogId).populate("author", "-password -tkey").exec();
  },

  getRawBlogFromDB: async (id) => {
    const blogId = castObjectId(id);

    if (!blogId) {
      return null;
    }

    return Post.findById(blogId).exec();
  },

  getPublishedUserBlogsFromDB: async (userId) => {
    // find posts with matching author, with publish dates NOT in the future
    // sort by descending publishDate
    const author = castObjectId(userId);

    if (!author) {
      return author;
    }

    const currentDate = new Date();

    return Post.find({
      author,
      publishDate: { $lte: currentDate },
    })
      .sort({ publishDate: -1 })
      .populate("author", "-password -tkey")
      .exec();
  },

  getAllUserBlogsFromDB: async (userId) => {
    const author = castObjectId(userId);

    if (!author) {
      return author;
    }

    // sort by descending publishDate
    return Post.find({ author })
      .sort({ publishDate: -1 })
      .populate("author", "-password -tkey")
      .exec();
  },

  addBlogToDB: async (blog) => {
    const author = castObjectId(blog.author);

    if (!author) {
      return author;
    }

    return new Post({ ...blog, author }).save();
  },

  updateBlogInDB: async (id, blog) => {
    const blogId = castObjectId(id);

    if (!blogId) {
      return blogId;
    }

    return Post.findByIdAndUpdate(blogId, blog).lean();
  },

  deleteBlogFromDB: async (id) => {
    const blogId = castObjectId(id);

    if (!blogId) {
      return blogId;
    }

    return Post.findByIdAndDelete(blogId);
  },
};

const blogQueries = mongoQueries;

export default blogQueries;
