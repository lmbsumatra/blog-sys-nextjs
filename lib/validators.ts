import { z } from 'zod';


export const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters long" });

export const signUpFormSchema = z.object({
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


export const logInFormSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});



export const blogValidator = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characaters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characaters long" }),
  banner: z.string().min(1, { message: "Image must be a url" }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .max(50, { message: "Slug cannot be more than 50 characters" })
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  category: z.enum([
    "Personal",
    "Electronics",
    "Gadgets",
    "Documents",
    "ID",
    "Wearables",
    "Accessories",
    "Clothing",
    "School Materials",
    "Others",
  ]),
});


const header = z.object({
  sectionType: z.literal("header"),
  index: z.number().optional(),
  content: z
    .string()
    .min(5, { message: "Header must be at least 5 characters" }),
});

const list = z.object({
  sectionType: z.literal("list"),
  index: z.number().optional(),
  content: z
    .array(z.string())
    .min(1, { message: "List must have at least one item" }),
});

const image = z.object({
  sectionType: z.literal("image"),
  index: z.number().optional(),
  content: z.string({ message: "Invalid image URL" }),
});

const text = z.object({
  sectionType: z.literal("text"),
  index: z.number().optional(),
  content: z
    .string()
    .min(10, { message: "Text must be at least 10 characters" }),
});

const quote = z.object({
  sectionType: z.literal("quote"),
  index: z.number().optional(),
  content: z
    .string()
    .min(5, { message: "Quote must be at least 5 characters" }),
});

export const contentValidator = z.array(z.union([header, list, image, text, quote]));
