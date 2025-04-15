import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/HttpError";
import { ZodError } from "zod";
import logger from "../utils/logger"; 

export const errorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  if (err instanceof ZodError) {
    logger.error(`Validation failed: ${JSON.stringify(err.flatten().fieldErrors)}`);
  } else if (err instanceof HttpError) {
    logger.error(`HttpError - ${err.statusCode}: ${err.message}`);
  } else {
    logger.error(`Unhandled error: ${err.message || err}`);
  }

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

    // console.error("Unhandled error:", err);

  res.status(500).json({
    message: "Something went wrong",
    details: "Internal Server Error",
  });
};
