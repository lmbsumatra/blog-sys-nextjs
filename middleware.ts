import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("auth-token")?.value || null;


    let userRole = null;
    if (token) {
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            userRole = tokenData.userRole;
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    const getRedirectUrl = () => {
        if (userRole === "superadmin") {
            return new URL("/superadmin", req.url);
        } else if (userRole === "admin") {
            return new URL("/admin", req.url);
        } else if (userRole === "user") {
            return new URL("/user", req.url);
        } else {
            return new URL("/login", req.url);
        }
    };

    const authRoutes = ["/login", "/sign-up"];

    if (token && authRoutes.includes(pathname)) {
        return NextResponse.redirect(getRedirectUrl());
    }

    if (!token) {
        const protectedRoutes = ["/superadmin", "/admin", "/user"];
        if (protectedRoutes.some(route => pathname.startsWith(route))) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (
            pathname.includes("/api/superadmin") ||
            pathname.includes("/api/admin") ||
            pathname.includes("/api/user")
        ) {
            return new NextResponse(
                JSON.stringify({ success: false, message: "Authentication failed" }),
                {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }
    } else {
        if (
            (pathname.startsWith("/superadmin") || pathname.startsWith("/api/superadmin")) &&
            userRole !== "superadmin"
        ) {
            return pathname.startsWith("/api")
                ? new NextResponse(
                    JSON.stringify({ success: false, message: "Unauthorized" }),
                    { status: 403, headers: { 'Content-Type': 'application/json' } }
                )
                : NextResponse.redirect(getRedirectUrl());
        }

        if (
            (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) &&
            userRole !== "admin" && userRole !== "superadmin"
        ) {
            return pathname.startsWith("/api")
                ? new NextResponse(
                    JSON.stringify({ success: false, message: "Unauthorized" }),
                    { status: 403, headers: { 'Content-Type': 'application/json' } }
                )
                : NextResponse.redirect(getRedirectUrl());
        }

        if (
            (pathname.startsWith("/user") || pathname.startsWith("/api/user")) &&
            !["user", "admin", "superadmin"].includes(userRole || "")
        ) {
            return pathname.startsWith("/api")
                ? new NextResponse(
                    JSON.stringify({ success: false, message: "Unauthorized" }),
                    { status: 403, headers: { 'Content-Type': 'application/json' } }
                )
                : NextResponse.redirect(getRedirectUrl());
        }
    }

    return NextResponse.next();
}

// Define the routes to apply the middleware to
export const config = {
    matcher: [
        "/login",
        "/sign-up",
        "/superadmin/:path*",
        "/admin/:path*",
        "/user/:path*",
        "/api/superadmin/:path*",
        "/api/admin/:path*",
        "/api/user/:path*"
    ],
};