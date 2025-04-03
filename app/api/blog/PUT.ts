import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
    try {
        return NextResponse.json({
            message: "Blog created successfully!",
        }, { status: 200 });

    } catch (error) {


        return NextResponse.json({
            message: "Internal Server Error",
            error: (error as any).toString(),
        }, { status: 500 });
    }
};
