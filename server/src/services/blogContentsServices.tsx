import { eq, and } from "drizzle-orm";
import { db } from "../db/db_connection";
import { schema } from "../db/schemas";
import { Content } from "../types/type";

const insert = async (data: Content) => {
  return await db.insert(schema.blogContentsTable).values(data).returning();
};

const updateBlogContents = async (
  updates: Partial<Content>,
  contentId: number
) => {
  return await db
    .update(schema.blogContentsTable)
    .set(updates)
    .where(eq(schema.blogsTable.id, contentId));
};

const selectOne = async (blogId: number) => {
  return await db.query.blogsTable.findFirst({
    where: eq(schema.blogsTable.id, blogId),
  });
};
const deleteOne = async (blogId: number, userId: number) => {
  return await db
    .delete(schema.blogContentsTable)
    .where(
      and(
        eq(schema.blogContentsTable.blogId, blogId)
      )
    )
    .returning();
};

const selectAll = async () => {
  return await db.query.blogContentsTable.findMany();
};

export const blogContentServices = {
  insert,
  updateBlogContents,
  selectOne,
  selectAll,
  deleteOne,
};
