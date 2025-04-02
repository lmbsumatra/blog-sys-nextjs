import {
    text,
    serial,
    pgEnum,
    pgTable,
    integer,
} from "drizzle-orm/pg-core";
import { blogsTable } from "./blogsModel";

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
    content: text("content").notNull(),
    index: integer("index").notNull(),
});
