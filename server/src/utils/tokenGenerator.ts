import jwt from"jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const tokenGenerator = async (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });

  //sample usage
  //   if (email === "test@example.com" && password === "password123") {
  //     const token = generateToken(userId); // 
  //     return res.json({ message: "Login successful!", token });
  //   }
};

