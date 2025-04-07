import { eq, and } from "drizzle-orm";
import { db } from "../db/db_connection";
import { schema } from "../db/schemas";
import { Content } from "../types/type";

const insert = async (data: Content) => {
  return await db.insert(schema.blogContentsTable).values(data).returning();
};

const selectOne = async (blogId: number) => {
  return await db.query.blogsTable.findFirst({
    where: eq(schema.blogsTable.id, blogId),
  });
};
const deleteOne = async (blogId: number, userId: number) => {
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

const selectAll = async () => {
  return await db.query.blogContentsTable.findMany();
};

export const blogContentServices = { insert, selectOne, selectAll, deleteOne };
