import { userServices } from "../../services/userServices";
import bcrypt from "bcrypt";
const saltRounds = 10;
import { userUpdateValidator } from "../../validators/userUpdateValidator";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../../utils/HttpError";
import { NewUser, UpdatedUserDTO } from "types/type";

export const updateById = async (req: Request, res: Response<UpdatedUserDTO>, next: NextFunction) => {
  const updates = req.body;
  const id = Number(req.params.id);
  try {
    // check data
    if (!updates || Object.keys(updates).length === 0) {
      throw new HttpError("No data to update", 400);
    }

    const userUpdateValidationResult = userUpdateValidator.parse({
      ...updates,
      id: id,
    });

    updates.password = await bcrypt.hash(updates.password, saltRounds);
    
    const updatedUser: NewUser = await userServices.updateUser(updates, id);

    res.send({ message: "User updated succesfully!", user: updatedUser });
  } catch (error) {
    next(error)
  }
};


