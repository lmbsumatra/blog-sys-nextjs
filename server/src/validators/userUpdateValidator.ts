import z = require("zod");

export const userUpdateValidator = z.object({
  id: z.string().min(1, { message: "User Id is required." }),
  firstName: z
    .string()
    .min(1, { message: "First name is required." })
    .optional(),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required." }).optional(),
  userName: z.string().min(1, { message: "Username is required." }).optional(),
  email: z
    .string()
    .min(1, { message: "Email is required if provided." })
    .email()
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password should be at least 8 characters." })
    .regex(/[A-Z]/, {
      message: "Password should have at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password should have at least one lowercase letter.",
    })
    .regex(/\d/, { message: "Password should have at least one digit." })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password should have at least one special character.",
    })
    .optional(),
});

