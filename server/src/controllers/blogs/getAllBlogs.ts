import { NextFunction, Request, Response } from "express";
import { blogServices } from "../../services/blogServices";
import { AllBlogsDTO } from "types/type";

export const getAllBlogs = async (req: Request, res: Response<AllBlogsDTO>, next: NextFunction) => {
  try {
    const blogs = await blogServices.selectAll();
    res.status(201).json({
      message: "Blogs fetch successfully!",
      blogs,
    });
  } catch (error) {
    next(error)
  }
};

