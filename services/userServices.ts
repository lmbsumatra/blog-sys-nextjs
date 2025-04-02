import { db } from "@/db";
import { schema } from "@/db/schema/index";
import { User } from "@/lib/types";
import { eq, and } from "drizzle-orm";

export const insert = async (data: User[]): Promise<User[]> => {
    return await db.insert(schema.usersTable).values(data).returning();
};

export const selectAll = async (): Promise<User[]> => {
    return db.query.usersTable.findMany({});
};

export const selectOne = async (userId: number, userRole: 'user' | 'admin' | 'superadmin'): Promise<User | null> => {
    const user = await db.query.usersTable.findFirst({
        where: and(
            eq(schema.usersTable.id, userId),
            eq(schema.usersTable.role, userRole)
        ),
    });
    return user || null;
};

export const selectOneWithEmail = async (email: string): Promise<User | null> => {
    const user = await db.query.usersTable.findFirst({
        where: eq(schema.usersTable.email, email),
    });
    return user || null;
};

export const updateUser = async (updates: Partial<User>, id: number): Promise<User | null> => {
    const updatedUser = await db
        .update(schema.usersTable)
        .set(updates)
        .where(eq(schema.usersTable.id, id))
        .returning();
    return updatedUser.length > 0 ? updatedUser[0] : null;
};


export const deleteUser = async (userId: number): Promise<User | null> => {
    const result = await db
        .delete(schema.usersTable)
        .where(eq(schema.usersTable.id, userId))
        .returning();

    return result.length > 0 ? result[0] : null;
};
