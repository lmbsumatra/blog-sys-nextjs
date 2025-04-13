

import { usersTable } from "../db/schemas/UserModel";
import { blogsTable } from "../db/schemas/BlogsModel";
import { blogContentsTable } from "../db/schemas/BlogContentsModel";
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export interface RequestWithUploads extends Request {
  uploadedFiles?: {
    banner: Express.Multer.File | null;
    sectionImages: Express.Multer.File[];
  };
}

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
  | { blogId: number; index: number; sectionType: "title"; content: string }
  | { blogId: number; index: number; sectionType: "banner"; content: string }
  | { blogId: number; index: number; sectionType: "category"; content: string }
  | { blogId: number; index: number; sectionType: "description"; content: string }
  | { blogId: number; index: number; sectionType: "text"; content: string }
  | { blogId: number; index: number; sectionType: "quote"; content: string }
  | { blogId: number; index: number; sectionType: "header"; content: string }
  | { blogId: number; index: number; sectionType: "image"; content: string }
  | { blogId: number; index: number; sectionType: "slug"; content: string }
  | { blogId: number; index: number; sectionType: "list"; content: string[] };


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


export type NewUser = InferInsertModel<typeof usersTable>;
export type User = InferSelectModel<typeof usersTable>;

export type UserWithBlogs = User & {
  blogs: Blog[];
};

export type Blog = InferInsertModel<typeof blogsTable>;
export type NewBlog = InferInsertModel<typeof blogsTable>;

export type Content = InferInsertModel<typeof blogContentsTable>;
export type NewContent = InferSelectModel<typeof blogContentsTable>;

export type ContentSection = {
  type: "text" | "header" | "image" | "list" | "quote";
  content: string | string[];
};

export type SectionImagesMap = {
  [key: string]: Express.Multer.File | undefined;
};


// different types of interface

// *don't need to make interface for primitive ones

// *on controllers, when returning an object to client
//  it is always Promise<void> because the method dont excatly
//  return any value but rahter the Response that returns an object to client
//  const SomeMethod = (res: Response<ThisCouldBeExtended>, req: Request<ThisCouldBeExtended>):Promise<AlwaysVoid> => {}

//  using Promise<void> only when async method, if not, void alone
// 1. request dto -> interfaces that coms from client

// 2. respoense dto -> interfaces that is sent to client
export interface SignUpUserDTO {
  message: string,
  user: NewUser
}

export interface LoginUserDTO {
  message: string,
  role: 'user' | 'admin' | 'superadmin'
}

export interface AllBlogsDTO {
  message: string,
  blogs: Blog[] // adding [] after an interface makes it araay?
}

export interface BlogBySlugDTO {
  message: string,
  blog: BlogSection[], 
  user: Partial<User>
}

export interface UpdatedBlogDTO {
  message: string,
  blog: Blog, // adding [] after an interface makes it araay?
  blogContent: BlogSection | null
}

export interface AllUsersDTO {
  message: string,
  users: User[]
}

export interface UserDTO {
  message: string,
  user: User
}

export interface UpdatedUserDTO {
  message: string,
  user: Partial<User>
}

// 3. database/schema -> interfaces that matches the db tables

// 4. custom -> for enxtending interfaces like Request (adding token on body)

export interface ValidationErrorResponse {
  message: string;
  errors: {
    [key: string]: string[];
  };
}

export interface GenericErrorResponse {
  message: string;
  details?: string;
}

export type ErrorResponse = ValidationErrorResponse | GenericErrorResponse;

