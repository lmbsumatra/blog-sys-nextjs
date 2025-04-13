import jwt from "jsonwebtoken";
import { TokenManager } from "../utils/TokenManager";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/HttpError";

declare global {
  namespace Express {
    interface Request {
      token?: {
        userId: number;
        userRole: 'user' | 'admin' | 'superadmin';
      };
    }
  }
}

interface JwtPayloadWithUserRole extends jwt.JwtPayload {
  userId: number;
  userRole:  'user' | 'admin' | 'superadmin';
}

export const userAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies['auth-token'];
    if (!token) {
      throw new HttpError("Token is required.", 400);
    }

    let verified;

    if (token) {
      verified = await TokenManager.verifyToken(token);
    }

    if (verified && typeof verified !== 'string') {
      const verifiedPayload = verified as JwtPayloadWithUserRole;
      req.token = { userId: verifiedPayload.userId, userRole: verifiedPayload.userRole };
      next();
    } else {
      throw new HttpError("Invalid token.", 400);
    }
  } catch (error) {
    next(error);
  }
};
