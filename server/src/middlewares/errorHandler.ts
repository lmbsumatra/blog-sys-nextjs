import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/HttpError";
import { ZodError } from "zod";

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    message: "Something went wrong",
    details: "Internal Server Error",
  });
};
