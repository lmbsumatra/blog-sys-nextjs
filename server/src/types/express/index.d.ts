import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      token?: {
        userId: number; 
        userRole?: string;
      };
    }
  }
}
