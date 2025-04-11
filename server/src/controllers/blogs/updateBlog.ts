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

export const updateBlog = async (req: RequestWithUploads, res: Response): Promise<void> => {
    try {
        const { title, description, banner, slug, category, content } = req.body;
        const { blogSlug } = req.params;

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

        const existingBlog = await blogServices.selectOne(blogSlug);

        if (!existingBlog || existingBlog.userId !== req.token.userId) {
            res.status(403).json({ message: "Not authorized to edit this blog" });
            return;
        }

        const categoryTyped = category as ValidCategory;

        const updatedSlug = slug !== existingBlog.slug
            ? await generateUniqueSlug(slug || await generateSlug(title))
            : existingBlog.slug;

        const bannerPath = banner.startsWith("http")
            ? banner
            : req.uploadedFiles?.banner?.path
                ? path.join("uploads", path.basename(req.uploadedFiles.banner.path))
                : existingBlog.banner;

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

        const blogContents = [];

        const validContentSections = processedContent.filter(
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
            blogContents.push(insertedContent);
        }

        res.status(200).json({
            message: "Blog updated successfully!",
            blog: { ...existingBlog, ...blogData },
            blogContent: blogContents,
        });

    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "Validation failed",
                errors: error.flatten(),
            });
            return;
        }
        if (error instanceof Error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            });
            return;
        }
    }
};
