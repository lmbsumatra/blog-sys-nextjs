

import { usersTable } from "../db/schemas/UserModel";
import { blogsTable } from "../db/schemas/BlogsModel";
import { blogContentsTable } from "../db/schemas/BlogContentsModel";
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export interface UploadedFile {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

export interface UploadedFiles {
  banner: UploadedFile | null;
  sectionImages: UploadedFile[]; 
}

export type BlogSection =
  | { sectionType: "title"; content: string }
  | { sectionType: "banner"; content: string }
  | { sectionType: "category"; content: string }
  | { sectionType: "description"; content: string }
  | { sectionType: "text"; content: string }
  | { sectionType: "quote"; content: string }
  | { sectionType: "header"; content: string }
  | { sectionType: "image"; content: string } 
  | { sectionType: "list"; content: string[] };


export type ValidCategory =
  | "Personal"
  | "Electronics"
  | "Gadgets"
  | "Documents"
  | "ID"
  | "Wearables"
  | "Accessories"
  | "Clothing"
  | "School Materials"
  | "Others";


export interface RequestWithUploads extends Request {
  uploadedFiles?: UploadedFiles;
  token?: {
    userId: number;
    userRole?: string;
  };
}


export type NewUser = InferInsertModel<typeof usersTable>;
export type User = InferSelectModel<typeof usersTable>;

export type UserWithBlogs = User & {
  blogs: Blog[];
};

export type Blog = InferInsertModel<typeof blogsTable>;
export type NewBlog = InferInsertModel<typeof blogsTable>;

// export type NewBlog = {
//     title: string;
//     banner: string;
//     slug: string;
//     category: typeof categoryEnum.enumValues[number];
//     description: string;
//     userId: number;
//     status: typeof blogStatusEnum.enumValues[number];
//   };

export type Content = InferInsertModel<typeof blogContentsTable>;
export type NewContent = InferSelectModel<typeof blogContentsTable>;

export type ContentSection = {
  type: "text" | "header" | "image" | "list" | "quote";
  content: string | string[];
};

export type SectionImagesMap = {
  [key: string]: Express.Multer.File | undefined;
};

