import { usersTable } from "./userModel";
import { blogsTable } from "./blogsModel";
import { blogContentsTable } from "./blogContentsModel";

import { relations } from "drizzle-orm";

export const usersRelations = (tables: { blogsTable: typeof blogsTable }) => {
  const { blogsTable } = tables;
  return relations(usersTable, ({ many }) => ({
    blogs: many(blogsTable),
  }));
};


export const blogsRelations = (tables: { usersTable: typeof usersTable, blogContentsTable: typeof blogContentsTable }) => {
  const { usersTable, blogContentsTable } = tables;
  return relations(blogsTable, ({ one, many }) => ({
    user: one(usersTable, {
      fields: [blogsTable.userId],   
      references: [usersTable.id],   
    }),
    contents: many(blogContentsTable),
  }));
};



export const blogContentsRelations = (tables: { blogsTable: typeof blogsTable }) => {
  const { blogsTable } = tables;
  return relations(blogContentsTable, ({ one }) => ({
    blog: one(blogsTable, {
      fields: [blogContentsTable.blogId],
      references: [blogsTable.id],
    }),
  }));
};
