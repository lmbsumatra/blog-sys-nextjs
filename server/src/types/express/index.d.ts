import { Request } from 'express';

declare global {
  namespace Express {
    interface Request { // extends Request interface to add to Request body the token wc holds the userId & userRole
      token?: {
        userId: number;
        userRole: string;
      };
    }
  }
}
