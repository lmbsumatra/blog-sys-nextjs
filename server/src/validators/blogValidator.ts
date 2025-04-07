import z = require("zod");

export const blogValidator = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characaters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characaters long" }),
  banner: z.string().min(1, { message: "Image must be a url" }).optional(),
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

