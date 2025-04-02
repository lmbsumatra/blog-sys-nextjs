import { signUpFormSchema } from "@/lib/validators";
import { insert } from "@/services/userServices";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
const saltRounds = 10;

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const signUpFormSchemaResult = signUpFormSchema.parse(data);

    data.password = await bcrypt.hash(data.password, saltRounds)

    const user = await insert(data);

    return NextResponse.json({ message: "Signed up!", user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error });
  }
};
