import { createBlog } from "./createBlog";
import { deleteBlogById } from "./deleteBlogById";
import { getAllBlogs } from "./getAllBlogs";
import { getBlogById } from "./getBlogById";

export const BlogsController = {
  createBlog,
  getBlogById,
  getAllBlogs,
  deleteBlogById,
};

