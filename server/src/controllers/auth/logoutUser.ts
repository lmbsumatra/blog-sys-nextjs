import { NextFunction, Request, Response } from 'express';

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    res.json({ message: "Logged out successfully." });
    return;
  } catch (error) {
    next(error)
  }
};
