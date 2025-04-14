import path from "path";
import { Request, Response, NextFunction } from "express";
import { blogServices } from "../../services/blogServices";
import { blogContentServices } from "../../services/blogContentsServices";
import { blogValidator } from "../../validators/blogValidator";
import { generateSlug, generateUniqueSlug } from "../../helpers/generateUniqueSlug";
import { BlogSection, NewBlog, ValidCategory } from "../../types/type";
import { HttpError } from "../../utils/HttpError";
import { validCategories } from "../../config/constants";

interface UploadedFile {
  path: string;
}

interface RequestWithUploads extends Request {
  uploadedFiles?: {
    banner: Express.Multer.File | null;
    sectionImages: Express.Multer.File[];
  };
}

export const createBlog = async (req: RequestWithUploads, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, banner, category, slug, content } = req.body;

    if (!req.token || !req.token.userId) {
      throw new HttpError("Unauthorized", 401);
      return;
    }

    if (!title || !description || !category || !content) {
      throw new HttpError("Missing required fields", 401);
      return;
    }

    if (!validCategories.includes(category as ValidCategory)) {
      throw new HttpError("Invalid category", 401);
      return;
    }

    const categoryTyped = category as ValidCategory;

    const baseSlug = slug ? slug : await generateSlug(title);
    const finalSlug = await generateUniqueSlug(baseSlug);

    const bannerPath = banner && typeof banner === 'string' && banner.startsWith("http")
  ? banner
  : req.uploadedFiles?.banner?.path
    ? path.join("uploads", path.basename(req.uploadedFiles.banner.path))
    : "";

    const processContentImages = (
      contentSections: BlogSection[],
      sectionImages: UploadedFile[]
    ): BlogSection[] => {
      let imageQueue = [...sectionImages];
      return contentSections.map(section => {
        if (section.sectionType === "image" && imageQueue.length > 0) {
          const img = imageQueue.shift()!;
          return {
            ...section,
            content: path.join("uploads", path.basename(img.path)),
          };
        }
        return section;
      });
    };

    const processedContent = processContentImages(content, req.uploadedFiles?.sectionImages || []);

    const blogData: NewBlog = {
      title,
      banner: bannerPath,
      slug: finalSlug,
      category: categoryTyped,
      description,
      userId: req.token.userId,
      status: "unpublish",
    };

    blogValidator.parse(blogData);

    const blog = await blogServices.insert(blogData);
    const blogId = blog[0].id;

    let blogContents: any[] = [];

    const validContentSections = processedContent.filter(
      (section) => ["image", "header", "list", "text", "quote"].includes(section.sectionType)
    );

    for (let i = 0; i < validContentSections.length; i++) {
      const section = validContentSections[i];
      const contentData = {
        blogId,
        sectionType: section.sectionType as "image" | "header" | "list" | "text" | "quote",
        index: i,
        content: Array.isArray(section.content) ? section.content.join(' ') : section.content,
      };
      const insertedContent = await blogContentServices.insert(contentData);
      blogContents.push(insertedContent);
    }

    res.status(201).json({
      message: "Blog created successfully!",
      blog,
      blogContent: blogContents,
    });

  } catch (error) {
    next(error)
  }
};
