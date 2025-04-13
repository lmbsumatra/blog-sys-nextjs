import { ZodError } from "zod";
import bcrypt from "bcrypt";

import { userServices } from "../../services/userServices";
import { userCreationValidator } from "../../validators/userCreationValidator";
import { NextFunction, Request, Response } from "express";
import { NewUser, SignUpUserDTO, User } from "../../types/type";

const saltRounds = 10;

export const signup = async (req: Request, res: Response<SignUpUserDTO>, next: NextFunction): Promise<void> => {
  const { firstName, middleName, lastName, userName, email, password } = req.body;

  try {
    userCreationValidator.parse({
      firstName,
      middleName,
      lastName,
      userName,
      email,
      password,
    });

    const data: NewUser = {
      firstName,
      middleName,
      lastName,
      userName,
      email,
      role: "user",
      password: await bcrypt.hash(password, saltRounds),
    };

    const user = await userServices.insert(data);

    res.status(201).json({
      message: "User created successfully",
      user,
    });
    return;
  } catch (error) {
    if (error instanceof ZodError) {
      next(error);
    }
    next(error);
  }
};
