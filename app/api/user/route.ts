import { TokenManager } from "@/lib/tokenManager";
import { selectOne } from "@/services/userServices";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {

  const token = req.headers.get("authorization")

  try {
    if (!req.headers.get("authorization") || !token) {
      return NextResponse.json({ error: "Token is required." }, { status: 401 });
    }

    let verified;

    if (token) {
      verified = await TokenManager.verifyToken(token);
    }

    const user = await selectOne(verified.userId, verified.userRole);

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }
    return NextResponse.json({ user, role: user.role }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
};
