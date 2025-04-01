import { insert, selectAll } from "@/services/userServices";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const users = await selectAll();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const user = await insert(data);
  // Your POST logic here
  return NextResponse.json({ message: "POST method is working!", data }, { status: 201 });
};
