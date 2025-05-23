import { timestamp, varchar, serial, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin", "superadmin"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  middleName: varchar("middle_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  userName: varchar("username", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

// circular dependency: resolved: tabes should be define and import first then pass to create relations
export const usersRelations = (tables: any) => {
  const { blogsTable } = tables;
  return relations(usersTable, ({ many }) => ({
    blogs: many(blogsTable),
  }));
};


