import { Request, Response } from "express";
import { blogServices } from "../../services/blogServices";

export const deleteBlogById = async (req: any, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const userId = Number(req?.token?.userId);

    if (!userId) {
      res.status(401).json({ message: "Invalid user ID." });
      return;
    }

    if (!slug) {
      res.status(400).json({ message: "Blog slug is required!" });
      return;
    }

    const blog = await blogServices.deleteOne(slug, userId);

    if (!blog || blog.length === 0) {
      res.status(404).json({ message: "Blog not found!" });
      return;
    }

    res.status(200).json({ message: "Blog deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete blog!",
      error: (error as Error).message,
    });
  }
};
