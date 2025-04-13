import path from "path";
import fs from "fs";
import multer from "multer";
import { Request, Response, NextFunction } from "express";

const uploadDir = path.join(__dirname, "../../public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, fileName);
  },
});

const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// 👇 Custom type extension for Request
declare module "express-serve-static-core" {
  interface Request {
    uploadedFiles?: {
      banner: Express.Multer.File | null;
      sectionImages: Express.Multer.File[];
    };
  }
}

export const uploadSectionImages = (req: Request, res: Response, next: NextFunction):void => {
  const uploadFields = [
    { name: "banner", maxCount: 1 },
    { name: "sectionImages", maxCount: 20 },
  ];

  const multerUpload = upload.fields(uploadFields);

  multerUpload(req, res, (err: any) => {
    if (err) {
      console.error("Multer Upload Error:", err);
      return res.status(400).json({ error: err.message });
    }

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    req.uploadedFiles = {
      banner: files?.["banner"]?.[0] ?? null,
      sectionImages: files?.["sectionImages"] ?? [],
    };

    try {
      req.body.content = typeof req.body.content === "string"
        ? JSON.parse(req.body.content)
        : req.body.content;
    } catch (parseError) {
      console.error("Content Parsing Error:", parseError);
      return res.status(400).json({ error: "Invalid content format" });
    }

    next();
  });
};
