import { Request, Response } from 'express';

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
    });

    res.json({ message: "Logged out successfully." });
    return;
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: "Internal server error" });
  }
};
