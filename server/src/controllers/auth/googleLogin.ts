import { Request, Response } from "express";
import { userServices } from "../../services/userServices";
import { TokenManager } from "../../utils/TokenManager";
import { HttpError } from "../../utils/HttpError";

export const googleCallbackController = async (req: Request, res: Response) => {
    try {
        const passportUser = req.user as any;
        const email = passportUser?.email;

        if (!email) {
            throw new HttpError("Login failed");
        }

        const user = await userServices.selectOneWithEmail(email);

        if (!user?.id || !user?.role) {
            throw new HttpError("Signup first");
        }

        const token = await TokenManager.generateToken({
            userId: user.id,
            userRole: user.role,
        });

        res.cookie("auth-token", token, {
            httpOnly: true,
            secure: false, // Change to true in production with HTTPS
            sameSite: "lax",
            maxAge: 1000 * 60 * 60, // 1 hour
        });

        res.redirect("http://localhost:3000/auth/success");
    } catch (err) {
        console.error("Error generating token:", err);
        res.redirect("http://localhost:3000/login?error=auth_failed");
    }
};
