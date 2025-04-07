import { db } from "../db_connection";
import { usersTable } from"../schemas/UserModel";
import { generateFakeUsers } from"./data/user";

export const seedUsers = async () => {
  try {
    const users = await generateFakeUsers(1);
    await db.insert(usersTable).values(users as any);
  } catch (error) {
    console.log("error: ", error);
  } finally {
    process.exit();
  }
};

seedUsers();

