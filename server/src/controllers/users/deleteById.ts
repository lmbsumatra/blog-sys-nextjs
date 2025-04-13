import { HttpError } from "../../utils/HttpError";
import { userServices } from "../../services/userServices";
import { NextFunction, Request, Response } from "express";

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = Number(req.params.userId);

  if (!req.params.userId || !userId) {
    throw new HttpError("User ID is required!", 400);
  }

  try {
    const deletedUser = await userServices.deleteUser(userId);
    res.status(201).json({
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    next(error)
  }
};
