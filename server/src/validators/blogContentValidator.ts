import z from"zod";

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


