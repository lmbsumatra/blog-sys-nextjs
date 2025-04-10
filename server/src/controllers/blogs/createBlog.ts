import path from "path";
import { Request, Response } from "express";
import { blogServices } from "../../services/blogServices";
import { blogContentServices } from "../../services/blogContentsServices";
import { blogValidator } from "../../validators/blogValidator";
import { ZodError } from "zod";
import { generateSlug, generateUniqueSlug } from "../../helpers/generateUniqueSlug";
import { NewBlog } from "../../types/type";

interface UploadedFile {
  path: string;
}

interface RequestWithUploads extends Request {
  uploadedFiles?: {
    banner: UploadedFile;
    sectionImages: UploadedFile[];
  };
  token?: {
    userId: number;
    userRole?: string;
  };
}

type BlogSection = {
  sectionType: string;
  content: string;
};

type ValidCategory =
  | "Personal"
  | "Electronics"
  | "Gadgets"
  | "Documents"
  | "ID"
  | "Wearables"
  | "Accessories"
  | "Clothing"
  | "School Materials"
  | "Others";

export const createBlog = async (req: RequestWithUploads, res: Response): Promise<void> => {
  try {
    const { title, description, banner, category, slug, content } = req.body;

    if (!req.token || !req.token.userId) {
      res.status(401).json({ message: 'Unauthorized: User ID not found' });
      return;
    }

    if (!title || !description || !banner || !category || !content) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const validCategories: ValidCategory[] = [
      "Personal", "Electronics", "Gadgets", "Documents", "ID", "Wearables",
      "Accessories", "Clothing", "School Materials", "Others"
    ];

    if (!validCategories.includes(category as ValidCategory)) {
      res.status(400).json({ message: "Invalid category" });
      return;
    }

    const categoryTyped = category as ValidCategory;

    const baseSlug = slug ? slug : await generateSlug(title);
    const finalSlug = await generateUniqueSlug(baseSlug);

    const bannerPath = banner.startsWith("http")
      ? banner
      : req.uploadedFiles?.banner?.path
        ? path.join("uploads", path.basename(req.uploadedFiles.banner.path))
        : (() => { throw new Error("Banner file is required!"); })();

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

    const blogContents = [];

    const validContentSections = processedContent.filter(
      (section) => ["image", "header", "list", "text", "quote"].includes(section.sectionType)
    );

    for (let i = 0; i < validContentSections.length; i++) {
      const section = validContentSections[i];
      const contentData = {
        blogId,
        sectionType: section.sectionType as "image" | "header" | "list" | "text" | "quote",
        index: i,
        content: section.content,
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
    if (error instanceof ZodError) {
      console.log("Validation Failed:", error.flatten());
      res.status(400).json({
        message: "Validation failed",
        errors: error.flatten(),
      });
      return;
    }
    if (error instanceof Error) {
      res.status(500).json({
        message: "Internal Server Error",
        error: error.toString(),
      });
      return;
    }
  }
};
