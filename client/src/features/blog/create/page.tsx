"use client";

import CreateEditBlog from "@/src/components/blogs/CreateEditBlog";
import { useParams } from "next/navigation";

const CreateBlogPage = () => {
  const { slug } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-00 mb-6 leading-tight">
        Create blog
      </h1>
      <CreateEditBlog mode="create" blogSlug={slug as string} />
    </div>
  );
};

export default CreateBlogPage;
