import { ZodError } from "zod";
import bcrypt from "bcrypt";
const saltRounds = 10;
import { userServices } from "../../services/userServices";
import { userCreationValidator } from "../../validators/userCreationValidator";
import { Request, Response } from "express";
import { NewUser } from "../../types/type";

export const signup = async (req: Request, res: Response): Promise<void> => {
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

    const data = {
      firstName,
      middleName,
      lastName,
      userName,
      email,
      role: "user",
      password: await bcrypt.hash(password, saltRounds),
    };

    const addedUser = await userServices.insert(data as NewUser);

    res.status(201).json({
      message: "User created successfully",
      addedUser,
    });
    return; 
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("Validation Failed:", error.flatten());

      res.status(400).json({
        message: "Validation failed",
        errors: error.flatten(),
      });
      return;
    }

    console.error("Error creating user:", error);

    res.status(500).json({
      error: "Failed to create user",
      details: "Internal Server Error",
    });
    return;
  }
};
