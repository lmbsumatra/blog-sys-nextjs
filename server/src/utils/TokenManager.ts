import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../types/type";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

export const TokenManager = {
  generateToken: (payload: { userId: number, userRole: User["role"] }, options = {}) => {
    try {
      const token = jwt.sign(payload, JWT_SECRET as string, options);
      return token;
    } catch (error) {
      return { message: "Failed token generation", error: (error as Error).message };
    }
  },

  verifyToken: (token: string): JwtPayload | { message: string } => {
    try {
      // Decoding the token with correct type
      const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
      return decoded;
    } catch (error) {
      return { message: "Failed verification" };
    }
  },
};
