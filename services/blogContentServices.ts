import { db } from "@/db";
import { schema } from "@/db/schema/index";
import { eq, and } from "drizzle-orm";

interface blog {

}

export const insert = async (data) => {
    return await db.insert(schema.blogContentsTable).values(data).returning();
};

export const selectOne = async (blogId) => {
    return await db.query.blogsTable.findFirst({
        where: eq(schema.blogsTable.id, blogId),
    });
};
export const deleteOne = async (blogId, userId) => {
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

export const selectAll = async (blogId) => {
    return await db.query.blogsTable.findMany();
};
