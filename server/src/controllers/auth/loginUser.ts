import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { TokenManager } from "../../utils/TokenManager";
import { userServices } from "../../services/userServices";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const missingFields = ["email", "password"].filter(
    (field) => !req.body[field] || req.body[field].trim() === ""
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      message: "Missing or empty required fields",
      details: missingFields,
    });
    return;
  }

  try {
    const user = await userServices.selectOneWithEmail(email);

    if (!user) {
      res.status(404).json({
        message: "User not found!",
      });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({
        message: "Wrong password!",
      });
      return;
    }

    const token = await TokenManager.generateToken({
      userId: user.id,
      userRole: user.role,
    });

    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    res.status(200).json({
      message: "Logged in!",
      role: user.role,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Server error!",
      details: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
};
