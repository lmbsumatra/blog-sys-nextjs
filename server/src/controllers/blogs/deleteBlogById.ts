import { NextFunction, Request, Response } from "express";
import { blogServices } from "../../services/blogServices";
import { HttpError } from "../../utils/HttpError";

export const deleteBlogById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const userId = Number(req?.token?.userId);


    if (!userId) {
      throw new HttpError("Invalid user ID.", 401);
      return;
    }

    if (!slug) {
      throw new HttpError("Blog slug is required!", 401);
      return;
    }

    const blog = await blogServices.deleteOne(slug, userId);

    if (!blog || blog.length === 0) {
      throw new HttpError("Blog not found!", 404);
      return;
    }

    res.status(200).json({ message: "Blog deleted successfully!" });
  } catch (error) {
    next(error)
  }
};
