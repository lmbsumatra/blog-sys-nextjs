import { NextRequest } from "next/server";

declare module "next/server" {
    interface NextRequest {
        uploadedFiles: {
            banner: Express.Multer.File | null;
            sectionImages: Express.Multer.File[];
        };
    }
}
