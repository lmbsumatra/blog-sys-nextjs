import { eq, and } from "drizzle-orm";
import { NewUser, User } from "../types/type";
import { db } from "../db/db_connection";
import { schema } from "../db/schemas";

const insert = async (data: NewUser) => {
  const user = await db.insert(schema.usersTable).values(data);
  return user.rows[0]; // mystery :: why do i still need to extract???
};

const selectAll = async (): Promise<User[]> => {
  return await db.query.usersTable.findMany({ with: { blogs: true } });
};

const selectOne = async (
  userId: number,
  userRole: User["role"]
): Promise<User | undefined> => {
  return await db.query.usersTable.findFirst({
    where: and(
      eq(schema.usersTable.id, userId),
      eq(schema.usersTable.role, userRole)
    ),
  });
};

const selectOneWithEmail = async (email: string): Promise<User | undefined> => {
  return await db.query.usersTable.findFirst({
    where: eq(schema.usersTable.email, email),
  });
};

const updateUser = async (updates: Partial<NewUser>, id: number) => {
  const result = await db
    .update(schema.usersTable)
    .set(updates)
    .where(eq(schema.usersTable.id, id));
  return result.rows[0];
};

const deleteUser = async (userId: number) => {
  return await db
    .delete(schema.usersTable)
    .where(eq(schema.usersTable.id, userId))
    .returning();
};
export const userServices = {
  insert,
  selectAll,
  selectOne,
  selectOneWithEmail,
  updateUser,
  deleteUser,
};
