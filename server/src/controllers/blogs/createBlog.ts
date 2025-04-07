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
    const body = req.body;

    console.log(body);

    if (!req.token || !req.token.userId) {
      res.status(401).json({ message: 'Unauthorized: User ID not found' });
      return;
    }

    let content: BlogSection[] = [];

    try {
      content = body; // Make sure content is an array of BlogSections
    } catch (e) {
      res.status(400).json({ message: "Invalid content format" });
      return;
    }

    const titleSection = content.find(section => section.sectionType === "title");
    const bannerSection = content.find(section => section.sectionType === "banner");
    const descriptionSection = content.find(section => section.sectionType === "description");
    const categorySection = content.find(section => section.sectionType === "category");

    if (!titleSection || !bannerSection || !categorySection || !descriptionSection) {
      res.status(400).json({ message: 'Missing required sections' });
      return;
    }

    const title = titleSection.content;
    const banner = bannerSection.content; // This can be a URL or a file path
    const category = categorySection.content;
    const description = descriptionSection.content;

    const validCategories: ValidCategory[] = [
      "Personal", "Electronics", "Gadgets", "Documents", "ID", "Wearables",
      "Accessories", "Clothing", "School Materials", "Others"
    ];

    if (!validCategories.includes(category as ValidCategory)) {
      res.status(400).json({ message: "Invalid category" });
      return;
    }

    const categoryTyped = category as ValidCategory;
    const baseSlug = await generateSlug(title);
    const slug = await generateUniqueSlug(baseSlug);

    // Handle the case where the banner is a URL or a file
    const bannerPath = banner.startsWith("http")
      ? banner
      : req.uploadedFiles?.banner?.path
        ? path.join("uploads", path.basename(req.uploadedFiles.banner.path))
        : (() => { throw new Error("Banner file is required!"); })();

    const processContentImages = (
      contentSections: BlogSection[],
      sectionImages: (string | UploadedFile)[]
    ): BlogSection[] => {
      let remainingSectionImages = [...sectionImages];
      return contentSections.map((section) => {
        if (section.sectionType === "image" && remainingSectionImages.length > 0) {
          const imageFile = remainingSectionImages.shift()!;
          return {
            ...section,
            content: typeof imageFile === "string" ? imageFile : path.join("uploads", path.basename(imageFile.path)),
          };
        }
        return section;
      });
    };

    const processedContent = processContentImages(
      content,
      req.uploadedFiles?.sectionImages || []
    );

    const blogData: NewBlog = {
      title,
      banner: bannerPath,
      slug,
      category: categoryTyped,
      description,
      userId: req.token.userId,
      status: "unpublish",
    };

    blogValidator.parse(blogData);

    const blog = await blogServices.insert(blogData);
    const blogId = blog[0].id;

    console.log({ blogId });

    type ValidSectionType = "image" | "header" | "list" | "text" | "quote";

    const filteredContent = processedContent.filter(
      (section) => !["banner", "title", "category", "slug", "description"].includes(section.sectionType)
    );

    const blogContents = [];
    for (let i = 0; i < filteredContent.length; i++) {
      const section = filteredContent[i];
      const contentData = {
        blogId,
        sectionType: section.sectionType as ValidSectionType,
        index: i,
        content: section.content
      };
      const insertedContent = await blogContentServices.insert(contentData);
      blogContents.push(insertedContent);
    }

    res.status(201).json({
      message: "Blog created successfully!",
      blog,
      blogContent: blogContents,
    });
    return;

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
