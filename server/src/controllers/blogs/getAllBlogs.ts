import { blogServices } from "../../services/blogServices";

export const getAllBlogs = async (req: any, res: any) => {
  try {
    const blogs = await blogServices.selectAll();

    res.status(201).json({
      message: "Blogs fetch successfully!",
      blogs,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

