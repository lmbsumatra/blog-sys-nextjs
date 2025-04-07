import { blogServices } from "../../services/blogServices";

export const getBlogById = async (req: any, res: any) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        message: "Blog slug is required!",
      });
    }

    const blog = await blogServices.selectOne(slug);

    return res.status(200).json({
      message: "Blog fetched successfully!",
      blog: [
        { id: 1, sectionType: "banner", value: blog.banner },
        { id: 2, sectionType: "title", value: blog.title },
        { id: 3, sectionType: "description", value: blog.description },
        { id: 4, sectionType: "slug", value: blog.slug },
        ...blog.content.map((content: any, index: number) => ({
          id: content.id || index + 5,
          sectionType: content.sectionType,
          value: content.content,
        })),
      ],
      user: blog.user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message || "Blog not found!",
    });
  }
};

