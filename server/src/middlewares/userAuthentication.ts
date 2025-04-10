import jwt from "jsonwebtoken";
import { TokenManager } from "../utils/TokenManager";

interface JwtPayloadWithUserRole extends jwt.JwtPayload {
  userId: string;
  userRole: string;
}

export const userAuthentication = async (req: any, res: any, next: any) => {

  try {
    const token = req.cookies['auth-token'];

    if (!token) {
      return res.status(400).json({ error: "Token is required." });
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
      return res.status(401).json({ error: "Invalid token." });
    }
  } catch (error) {
    console.error("JWT Middleware Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
