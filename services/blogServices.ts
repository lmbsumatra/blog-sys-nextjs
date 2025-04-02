import { db } from "@/db";
import { schema } from "@/db/schema/index";
import { Blog } from "@/lib/types";
import { eq, and } from "drizzle-orm";

export const insert = async (data: Blog[]): Promise<Blog[]> => {
  return await db.insert(schema.blogsTable).values(data).returning();
};

export const selectOne = async (slug: string) => {
  return await db.query.blogsTable.findFirst({
    where: eq(schema.blogsTable.slug, slug),
  })
};

export const deleteOne = async (slug: string, userId: number) => {
  const blog = await selectOne(slug);

  if (!blog) {
    throw new Error("Blog not found");
  }

  const blogId = blog.id;

  await db
    .delete(schema.blogContentsTable)
    .where(eq(schema.blogContentsTable.blogId, blogId));
  return await db
    .delete(schema.blogsTable)
    .where(
      and(
        eq(schema.blogsTable.id, blogId),
        eq(schema.blogsTable.userId, userId)
      )
    )
    .returning();
};

export const selectAll = async () => {
  return await db.query.blogsTable.findMany({
    with: { contents: true, user: true },
  })
};
