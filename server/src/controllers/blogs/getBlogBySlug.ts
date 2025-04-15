import { blogServices } from "../../services/blogServices";
import { HttpError } from "../../utils/HttpError";
import { Blog, BlogBySlugDTO, BlogSection } from "../../types/type";
import { NextFunction, Request, Response } from "express";

export const getBlogById = async (req: Request, res: Response<BlogBySlugDTO>, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!slug) {
      throw new HttpError("Blog slug is required!", 400);
    }

    const blog = await blogServices.selectOne(slug);

    const blogSections: BlogSection[] = [
      { blogId: blog.id, index: 1, sectionType: "banner", content: blog.banner },
      { blogId: blog.id, index: 2, sectionType: "title", content: blog.title },
      { blogId: blog.id, index: 3, sectionType: "description", content: blog.description },
      { blogId: blog.id, index: 4, sectionType: "category", content: blog.category },
      { blogId: blog.id, index: 5, sectionType: "slug", content: blog.slug },
      ...blog.content.map((content: any, index: number,) => {
        return {
          blogId: blog.id,
          index: index + 6,
          sectionType: content.sectionType,
          content: content.sectionType === "list"
            ? Array.isArray(content.content)
              ? content.content.join("\n") // Convert array to string
              : content.content
            : content.content,
        };
      }),
    ];

    res.status(200).json({
      message: "Blog fetched successfully!",
      blog: blogSections,
      user: blog.user
    });
  } catch (error) {
    next(error);
  }
};
