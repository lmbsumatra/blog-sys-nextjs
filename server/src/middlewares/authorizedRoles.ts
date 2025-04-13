import { Request, Response, NextFunction, RequestHandler } from "express";
import { HttpError } from "../utils/HttpError";



export const authorizedRoles = (...allowedRoles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.token?.userRole;

      if (!userRole) {
        throw new HttpError("Role is required.", 401);
      }

      if (!allowedRoles.includes(userRole)) {
        throw new HttpError("You have no access here.", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
