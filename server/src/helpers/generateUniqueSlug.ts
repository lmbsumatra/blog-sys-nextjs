import { eq } from "drizzle-orm";
import { db } from "../db/db_connection";
import { schema } from "../db/schemas";

export const generateUniqueSlug = async (baseSlug: string) => {
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const existingPost = await db.query.blogsTable.findFirst({
      where: eq(schema.blogsTable.slug, slug),
    });
    if (!existingPost) break;
    slug = `${baseSlug}-${count}`;
    count++;
  }

  return slug;
};

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/-+/g, "-"); 
};

