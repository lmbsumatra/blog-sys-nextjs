import { logInFormSchema } from "@/lib/validators";
import { selectOneWithEmail } from "@/services/userServices";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from 'zod';
import { TokenManager } from "@/lib/tokenManager";
import cookie from 'cookie';

export const POST = async (req: NextRequest) => {
  const data = await req.json();

  try {
    const logInFormSchemaResult = logInFormSchema.parse(data);
    
    const user = await selectOneWithEmail(data.email);
    if (!user) {
      return NextResponse.json({ message: "User not found! Sign up first" }, { status: 404 });
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    const token = TokenManager.generateToken({
      userId: user.id,
      userRole: user.role,
    });

    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Invalid credentials! Please check your email or password." }, { status: 401 });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60 * 24 * 7,  
      path: '/',
    };

    return NextResponse.json({ message: "Logged in!", userRole: user.role }, {
      status: 201,
      headers: {
        'Set-Cookie': cookie.serialize('auth-token', token, cookieOptions),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation failed: ", erorr: error.errors });
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
};
