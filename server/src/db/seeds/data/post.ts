import { faker } from "@faker-js/faker";
import { db } from "../../db_connection";
import { schema } from "../../schemas";

const getUserIdsFromDB = async () => {
  try {
    const users = await db
      .select({ id: schema.usersTable.id })
      .from(schema.usersTable);
    return users.map((user) => user.id);
  } catch (error) {
    console.error("Error fetching user IDs:", error);
    return [];
  }
};

export const generateFakePost = async (count = 10) => {
  const userIds = await getUserIdsFromDB();
  const dateLost = faker.date.past();

  if (userIds.length === 0) {
    throw new Error(
      "No users found in the database. Cannot generate lost items."
    );
  }

  return Array.from({ length: count }, () => ({
    userId: faker.helpers.arrayElement(userIds),
    title: faker.commerce.productName(),
    category: faker.helpers.arrayElement([
      "Others",
      "Personal",
      "Electronics",
      "Gadgets",
      "Documents",
      "ID",
      "Wearables",
      "Accessories",
      "Clothing",
      "School Materials",
    ]),
    content: faker.commerce.productDescription(),
    status: "pending",
  }));
};

