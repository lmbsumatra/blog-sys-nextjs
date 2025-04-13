import { createBlog } from "./createBlog";
import { deleteBlogById } from "./deleteBlogById";
import { getAllBlogs } from "./getAllBlogs";
import { getBlogById } from "./getBlogBySlug";
import { updateBlog } from "./updateBlog";

export const BlogsController = {
  createBlog,
  getBlogById,
  getAllBlogs,
  deleteBlogById,
  updateBlog
};

