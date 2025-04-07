import { db } from "@/db";
import { schema } from "@/db/schema/index";
import { BlogContent } from "@/lib/types";
import { eq, and } from "drizzle-orm";

const insert = async (data: BlogContent[]): Promise<BlogContent[]> => {
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
    return await db.query.blogsTable.findMany();
};


const BlogContentServices = {
    insert,
    selectOne,
    deleteOne,
    selectAll
};

export default BlogContentServices;