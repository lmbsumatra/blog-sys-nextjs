import { NextRequest, NextResponse } from "next/server";
import useAuthStore from "./app/store/useAuthStore";

export async function middleware(req: NextRequest) {
    // get url of requesting client
    const { pathname }: { pathname: string } = req.nextUrl;
    // token 
    // const token = localStorage.getItem("auth-storage")
    const token = req.headers.get("authorization") || req.cookies.get("token");
    // get user
    const { fetchUser, user } = useAuthStore();

    // if no user and has token
    if (!user && token) {
        await fetchUser();
    }

    // redirect to /[role]+req.url
    const redirect = () => {
        if (user?.role === "superadmin") {
            return NextResponse.redirect(new URL("/superadmin", req.url)); // e.g. http://localhost:3000/login -> http://localhost:3000/superadmin
        } else if (user?.role === "admin") {
            return NextResponse.redirect(new URL("/admin", req.url));
        } else if (user?.role === "user") {
            return NextResponse.redirect(new URL("/user", req.url));
        } else {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    };

    // authentication routes
    const authRoutes = ["/login", "/signup"];

    // check if has token, & matching role, redirect to their respective route, i.e./superadmin, /admin, /user
    if (
        !!token &&
        ((pathname.startsWith("/superadmin") && user?.role === "superadmin") ||
            (pathname.startsWith("/admin") && user?.role === "admin") ||
            (pathname.startsWith("/user") && user?.role === "user"))
    ) {
        return redirect();
    }


    // if already has token, & tries to access routes [...authRoutes] then redirect to their respective route, i.e./superadmin, /admin, /user
    if (!!token && authRoutes.includes(pathname)) {
        return redirect();
    }


    if (!token) {
        if (
            pathname.includes("/api/superadmin") ||
            pathname.includes("/api/admin") ||
            pathname.includes("/api/user")
        ) {
            return new NextResponse(
                JSON.stringify({ success: false, message: "Authentication failed" }),
                { status: 401 }
            );
        }
    } else {
        if (
            (pathname.startsWith("/api/superadmin") && user?.role !== "superadmin") ||
            (pathname.startsWith("/api/admin") && user?.role !== "admin") ||
            (pathname.startsWith("/api/user") && user?.role !== "user")
        ) {
            console.log(pathname, user?.role);
            return new NextResponse(
                JSON.stringify({ success: false, message: "Authentication failed" }),
                { status: 401 }
            );
        }
    }



    return NextResponse.next();


}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/superadmin",
        "/admin",
        "/user"
    ],
}
