import {
  timestamp,
  text,
  varchar,
  serial,
  pgEnum,
  pgTable,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./UserModel";

export const categoryEnum = pgEnum("category", [
  "Personal",
  "Electronics",
  "Gadgets",
  "Documents",
  "ID",
  "Wearables",
  "Accessories",
  "Clothing",
  "School Materials",
  "Others",
]);

export const blogStatusEnum = pgEnum("blog_status", ["unpublish", "published"]);

export const blogsTable = pgTable("blogs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  banner: varchar("banner", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  category: categoryEnum("category").default("Others").notNull(),
  status: blogStatusEnum("blog_status").default("unpublish").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", precision: 3 }).$onUpdate(
    () => new Date()
  ),
});

export const blogsRelations = (tables: any) => {
  const { usersTable, blogContentsTable } = tables;
  return relations(blogsTable, ({ one, many }) => ({
    user: one(usersTable, {
      fields: [blogsTable.userId],
      references: [usersTable.id],
    }),
    content: many(blogContentsTable,
      // {
      //   fields: [blogsTable.id],
      //   references: [blogContentsTable.blogId],
      // }
    ),
  }));
};

