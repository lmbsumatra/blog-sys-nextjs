import { db } from "@/db";
import { schema } from "@/db/schema/index";
import { eq, and } from "drizzle-orm";

interface Blog {
  userId: number,
  title: string,
  description: string,
  banner: string,
  slug: string,
  category: 'Personal' |
  'Electronics' |
  'Gadgets' |
  'Documents' |
  'ID' |
  'Wearables' |
  'Accessories' |
  'Clothing' |
  'School Materials' |
  'Others'
  createdAt?: Date; // ? question mark represents being optional
  updatedAt?: Date | null;

}

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
    with: { content: true, user: true },
  })
};
