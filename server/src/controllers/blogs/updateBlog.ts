import path from "path";
import { NextFunction, Request, Response, Express } from "express";
import { blogServices } from "../../services/blogServices";
import { blogContentServices } from "../../services/blogContentsServices";
import { blogValidator } from "../../validators/blogValidator";
import { generateSlug, generateUniqueSlug } from "../../helpers/generateUniqueSlug";
import { NewBlog, UpdatedBlogDTO, BlogSection, ValidCategory } from "../../types/type";
import { HttpError } from "../../utils/HttpError";

interface UploadedFile {
    path: string;
}

interface RequestWithUploads extends Request {
    uploadedFiles?: {
        banner: Express.Multer.File | null;
        sectionImages: Express.Multer.File[];
    };
}


export const updateBlog = async (req: RequestWithUploads, res: Response<UpdatedBlogDTO>, next: NextFunction): Promise<void> => {
    try {
        const { title, description, banner, slug, category, content } = req.body;
        const { blogSlug } = req.params;

        if (!req.token || !req.token.userId) {
            throw new HttpError("User not found!", 401);
            return;
        }

        if (!title || !description || !category || !content) {
            throw new HttpError("Missing required fields!", 400);
            return;
        }

        const validCategories: ValidCategory[] = [
            "Personal", "Electronics", "Gadgets", "Documents", "ID", "Wearables",
            "Accessories", "Clothing", "School Materials", "Others"
        ];

        if (!validCategories.includes(category as ValidCategory)) {
            throw new HttpError("Invalid category!", 400);
            return;
        }

        const existingBlog = await blogServices.selectOne(blogSlug);

        if (!existingBlog || existingBlog.userId !== req.token.userId) {
            throw new HttpError("You are not authorized to edit this blog!", 400);
            return;
        }

        const categoryTyped = category as ValidCategory;

        const updatedSlug = slug !== existingBlog.slug
            ? await generateUniqueSlug(slug || await generateSlug(title))
            : existingBlog.slug;

        const bannerPath = banner && typeof banner === 'string' && banner.startsWith("http")
            ? banner
            : req.uploadedFiles?.banner?.path
                ? path.join("uploads", path.basename(req.uploadedFiles.banner.path))
                : "";

        const processContentImages = (
            contentSections: { sectionType: string; content: string }[],
            sectionImages: UploadedFile[]
        ): { sectionType: string; content: string }[] => {
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

        const flatProcessedContent = processedContent.flat();

        const blogData: Partial<NewBlog> = {
            title,
            banner: bannerPath,
            slug: updatedSlug,
            category: categoryTyped,
            description,
        };

        blogValidator.partial().parse(blogData);

        await blogServices.updateBlog(blogData, existingBlog.id);

        await blogContentServices.deleteOne(existingBlog.id, req.token.userId);

        let blogContents

        const validContentSections = flatProcessedContent.filter(
            (section) => ["image", "header", "list", "text", "quote"].includes(section.sectionType)
        );

        for (let i = 0; i < validContentSections.length; i++) {
            const section = validContentSections[i];
            const contentData = {
                blogId: existingBlog.id,
                sectionType: section.sectionType as "image" | "header" | "list" | "text" | "quote",
                index: i,
                content: section.content,
            };

            const insertedContent = await blogContentServices.insert(contentData);

            const formattedContent: BlogSection = {
                blogId: existingBlog.id,
                index: i + 6,
                sectionType: section.sectionType as BlogSection["sectionType"],
                content: section.sectionType === "list" && typeof section.content === "string"
                    ? JSON.parse(section.content)
                    : section.content
            };

            blogContents = formattedContent;
        }

        res.status(200).json({
            message: "Blog updated successfully!",
            blog: { ...existingBlog, ...blogData },
            blogContent: blogContents || null,
        });
        return;

    } catch (error) {
        next(error);
    }
};