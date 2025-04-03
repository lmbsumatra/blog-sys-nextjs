import BlogContentServices from "@/services/blogContentServices";
import BlogServices from "@/services/blogServices";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
    try {
        const blogs = await BlogServices.selectAll()
        return NextResponse.json({
            message: "Blogs fetch successfully!",
            blogs,
        }, { status: 200 });

    } catch (error) {

        return NextResponse.json({
            message: "Internal Server Error",
            error: (error as any).toString(),
        }, { status: 500 });
    }
};
