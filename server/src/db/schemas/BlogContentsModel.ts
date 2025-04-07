import { blogsTable } from "./BlogsModel";
import {
  timestamp,
  text,
  varchar,
  serial,
  pgEnum,
  pgTable,
  integer,
} from "drizzle-orm/pg-core";
import  { relations } from "drizzle-orm";

export const sectionTypeEnum = pgEnum("section_type", [
  "header",
  "list",
  "image",
  "text",
  "quote",
]);

export const blogContentsTable = pgTable("contents", {
  id: serial("id").primaryKey(),
  blogId: integer("blog_id")
    .notNull()
    .references(() => blogsTable.id),
  sectionType: sectionTypeEnum("section_type").notNull(),
  content: text("content"),
  index: integer("index").notNull(),
});

export const blogContentsRelations = (tables: any) => {
  const { blogsTable } = tables;
  return relations(blogContentsTable, ({ one }) => ({
    content: one(blogsTable, {
      fields: [blogContentsTable.blogId],
      references: [blogsTable.id],
    }),
  }));
};

