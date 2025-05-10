import { eq, and } from "drizzle-orm";
import { db } from "../db/db_connection";
import { schema } from "../db/schemas";
import { Blog, NewBlog } from "../types/type";

const insert = async (data: NewBlog) => {
  try {
    return await db.insert(schema.blogsTable).values(data).returning();
  } catch (error: any) {
    throw new Error("Failed to insert blog: " + error.message);
  }
};

const updateBlog = async (updates: Partial<Blog>, id: number) => {
  return await db
    .update(schema.blogsTable)
    .set(updates)
    .where(eq(schema.blogsTable.id, id));
};

const selectOne = async (slug: Blog["slug"]) => {
  try {
    const blog = await db.query.blogsTable.findFirst({
      where: eq(schema.blogsTable.slug, slug),
      with: { content: true, user: true },
    });

    if (!blog) {
      throw new Error("Blog does not exist");
    }

    return blog;
  } catch (error: any) {
    throw new Error("Failed to fetch blog: " + error.message);
  }
};

const deleteOne = async (slug: Blog["slug"], userId: number) => {

  try {
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
  } catch (error: any) {
    throw new Error("Failed to delete blog: " + error.message);
  }
};

const selectAll = async (): Promise<Blog[]> => {
  try {
    return await db.query.blogsTable.findMany({
      with: { content: true, user: true },
    });
  } catch (error: any) {
    throw new Error("Failed to fetch all blogs: " + error.message);
  }
};

export const blogServices = {
  insert,
  updateBlog,
  selectOne,
  selectAll,
  deleteOne,
};
