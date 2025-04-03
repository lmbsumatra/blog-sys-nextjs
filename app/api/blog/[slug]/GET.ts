import BlogServices from "@/services/blogServices";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const pathname = req.nextUrl.pathname;
        const slug = pathname.split("/").pop();

        if (!slug) {
            return NextResponse.json(
                { message: "Slug is required" },
                { status: 401 }
            );
        }

        const blog = await BlogServices.selectOne(slug);

        if (!blog) {
            return NextResponse.json(
                { message: "Blog not found" },
                { status: 401 }
            );
        }

        const formattedBlog = [
            { id: 1, sectionType: "banner", value: blog.banner },
            { id: 2, sectionType: "title", value: blog.title },
            { id: 3, sectionType: "description", value: blog.description },
            { id: 4, sectionType: "slug", value: blog.slug },
            ...(blog.contents || []).map((content, index) => ({
                id: content.id || index + 5,
                sectionType: content.sectionType,
                value: content.content,
            })),

        ];

        return NextResponse.json(
            {
                message: "GET successful",
                blog: formattedBlog,
                user: blog.user,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching blog:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
};
