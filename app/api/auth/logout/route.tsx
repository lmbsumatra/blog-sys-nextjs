import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

export async function POST(req: NextRequest) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  };

  return NextResponse.json(
    { success: true, message: "Logged out successfully" },
    {
      status: 200,
      headers: {
        "Set-Cookie": cookie.serialize("auth-token", "", cookieOptions),
      },
    }
  );
}
