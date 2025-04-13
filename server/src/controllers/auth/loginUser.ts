import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { TokenManager } from "../../utils/TokenManager";
import { userServices } from "../../services/userServices";
import { HttpError } from "../../utils/HttpError";
import { LoginUserDTO } from "types/type";

export const login = async (req: Request, res: Response<LoginUserDTO>, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError("Missing or empty required fields!", 400);
    return;
  }

  try {
    const user = await userServices.selectOneWithEmail(email);

    if (!user) {
      throw new HttpError("User not found!", 404);
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new HttpError("Wrong Password!", 401);
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
    next(error)
    return;
  }
};
