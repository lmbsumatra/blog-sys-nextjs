import { NextFunction, Request, Response } from "express";
import { userServices } from "../../services/userServices";
import { AllUsersDTO } from "types/type";
export const getAll = async (req: Request, res: Response<AllUsersDTO>, next: NextFunction) => {
  try {
    const users = await userServices.selectAll();
    res.json({ message: "Fetched all users", users });
  } catch (error) {
    next(error)
  }
};


