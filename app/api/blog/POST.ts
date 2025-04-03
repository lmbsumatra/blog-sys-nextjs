import BlogServices from "@/services/blogServices";
import BlogContentServices from "@/services/blogContentServices";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import multer from "multer";
import { Blog, Section } from "../../../lib/types";
import { z } from "zod";
import SlugServices from "@/services/slugServices";
import { TokenManager } from "@/lib/tokenManager";

interface NextRequestWithFiles extends NextRequest {
    files: { [fieldname: string]: Express.Multer.File[] };
}

const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, fileName);
    },
});

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

export const POST = async (req: NextRequest) => {
    try {
        const content = await req.json();

        if (!Array.isArray(content)) {
            return NextResponse.json({ error: "Content should be an array of sections." }, { status: 400 });
        }
        const { uploadedFiles } = req as any;

        const bannerSection = content.find((section: Section) => section.sectionType === "banner");
        const titleSection = content.find((section: Section) => section.sectionType === "title");
        const descriptionSection = content.find((section: Section) => section.sectionType === "description");
        const categorySection = content.find((section: Section) => section.sectionType === "category");

        const title = titleSection?.content;
        const category = categorySection?.content;
        const description = descriptionSection?.content;

        const banner = uploadedFiles?.banner
            ? path.join("uploads", path.basename(uploadedFiles.banner.path))
            : (bannerSection?.content?.startsWith("http") ? bannerSection.content : null);

        const finalBanner = banner || "uploads/default-banner.jpg"; 

        const baseSlug = await SlugServices.generateSlug(title);
        const slug = await SlugServices.generateUniqueSlug(baseSlug);

        let verifiedUser;
        let userId = 0;

        const token = req.headers.get("authorization");
        if (token) {
            verifiedUser = await TokenManager.verifyToken(token);
            if (!verifiedUser) {
                userId = 1;
            } else {
                userId = verifiedUser.userId
            }
        }

        const blogData = {
            title,
            banner: finalBanner,  
            slug,
            category,
            description,
            status: `published`,
            userId: userId,
        };

        console.log(blogData)

        Object.keys(blogData).forEach((key) => {
            (blogData as Blog)[key as keyof Blog] === undefined && delete (blogData as Blog)[key as keyof Blog];
        });

        const processContentImages = (contentSections: any[], sectionImages: any[]) => {
            let remainingSectionImages = [...sectionImages];

            const processedSections = contentSections.map((section) => {
                if (section.sectionType === "image") {
                    if (section.content.startsWith("http")) {
                        return section; 
                    }
                    if (remainingSectionImages.length > 0) {
                        const imageFile = remainingSectionImages.shift();
                        const processedSection = {
                            ...section,
                            content: path.join("uploads", path.basename(imageFile.path)),
                        };
                        return processedSection;
                    }
                }
                return section;
            });
            return processedSections;
        };

        const processedContent = processContentImages(
            content,
            uploadedFiles?.sectionImages || []
        );

        const blog = await BlogServices.insert([blogData as Blog]);
        const blogId = blog[0].id;

        const ContentsWithBlogId = processedContent
            .filter(
                (content) =>
                    !["banner", "title", "category", "slug", "description"].includes(content.sectionType)
            )
            .map((content) => ({
                ...content,
                blogId: blogId,
            }));

        const blogContent = await BlogContentServices.insert(ContentsWithBlogId);

        return NextResponse.json({
            message: "Blog created successfully!",
            blog,
            blogContent,
        }, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                message: "Validation failed",
                errors: (error as any).flatten(),
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Internal Server Error",
            error: (error as any).toString(),
        }, { status: 500 });
    }
};
