import { z } from "zod";

export const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters long" });

export const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  userName: z.string().min(3, { message: "Username must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
  confirmPassword: z.string().min(6, { message: "Confirm password is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
