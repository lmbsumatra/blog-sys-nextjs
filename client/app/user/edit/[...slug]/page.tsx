"use client";

import CreateEditBlog from "@/app/components/blogs/CreateEditBlog";
import { useParams } from "next/navigation";

const EditBlogPage = () => {
  const { slug } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-00 mb-6 leading-tight">
        Edit blog
      </h1>
      <CreateEditBlog mode="edit" blogSlug={slug as string} />;
    </div>
  );
};

export default EditBlogPage;
