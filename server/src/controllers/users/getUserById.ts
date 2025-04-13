import { NextFunction, Request, Response } from "express";
import { userServices } from "../../services/userServices";
import { HttpError } from "../../utils/HttpError";
import { UserDTO } from "types/type";

export const getUserById = async (req: Request, res: Response<UserDTO>, next: NextFunction): Promise<void> => {
  const userId = Number(req?.token?.userId);
  const userRole = req?.token?.userRole;

  if (!req.token) {
    throw new HttpError("Unauthorized", 401);
  }

  if (!userId || !userRole) {
    { throw new HttpError("Missing or empty required fields", 400); }
  }

  try {
    const user = await userServices.selectOne(userId, userRole)
    if (!user || user === undefined) {
      throw new HttpError("User not found!", 400);
    }

    res.status(200).json({
      message: "Found user!",
      user: user,
    });
    return;
  } catch (error) {
    next(error)
  }
};

