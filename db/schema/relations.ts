import { usersTable } from "./userModel";
import { blogsTable } from "./blogsModel";
import { blogContentsTable } from "./blogContentsModel";
import { relations } from "drizzle-orm";

export const usersRelations = (tables: { blogsTable: any }) => {
  const { blogsTable } = tables;
  return relations(usersTable, ({ many }) => ({
    blogs: many(blogsTable), 
  }));
};

export const blogsRelations = (tables: { usersTable: any }) => {
  const { usersTable } = tables;
  return relations(blogsTable, ({ one }) => ({
    user: one(usersTable), 
  }));
};

export const blogContentsRelations = (tables: { blogsTable: any }) => {
  const { blogsTable } = tables;
  return relations(blogContentsTable, ({ one }) => ({
    content: one(blogsTable, {
      fields: [blogContentsTable.blogId],
      references: [blogsTable.id],
    }),
  }));
};
