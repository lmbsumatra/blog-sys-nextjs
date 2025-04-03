import { logInFormSchema } from "./validators";
import { z } from 'zod';

export interface User {
    id?: number,
    firstName: string;
    middleName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'superadmin',
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Blog {
    id?: number,
    userId: number,
    title: string,
    description: string,
    banner: string,
    slug: string,
    category: 'Personal' |
    'Electronics' |
    'Gadgets' |
    'Documents' |
    'ID' |
    'Wearables' |
    'Accessories' |
    'Clothing' |
    'School Materials' |
    'Others',
    status: 'unpublish' | 'published',
    createdAt?: Date; // ? question mark represents being optional
    updatedAt?: Date | null;
}

export interface BlogContent {
    id: number,
    blogId: number,
    sectionType: "header" |
    "list" |
    "image" |
    "text" |
    "quote",
    content: string,
    index: number,
}

export interface TanStackProviderProps {
    children: React.ReactNode;
}

export type LogInFormSchema = z.infer<typeof logInFormSchema>;

export interface LogInFormResponse {
    message: string,
    token: string,
    // userRole: object,
}

import { signUpFormSchema } from '@/lib/validators';

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;

export interface SignUpFormResponse {
    message: string,
}

export interface Section {
    sectionType: string;
    content: any;
}