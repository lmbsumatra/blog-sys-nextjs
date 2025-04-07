import z from "zod";

export const userCreationValidator = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required." }),
  userName: z.string().min(1, { message: "Username is required." }),
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email(),
  // .regex(
  //   !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
  //   { message: "Email should be valid." }
  // ),
  password: z
    .string()
    .min(8, { message: "Password should be atleast 8 characters." })
    .regex(/[A-Z]/, {
      message: "Password should have at least one uppercase letter ",
    })
    .regex(/[a-z]/, {
      message: "Password should have at least one lowercase letter",
    })
    .regex(/\d/, { message: "Password should have at least one digit" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password should have at least one special character",
    }),
});
