'use client';

import CreateEditBlog from "@/app/components/blogs/CreateEditBlog";
import { useParams } from "next/navigation";

const EditBlogPage = () => {
  const { slug } = useParams();

  return <CreateEditBlog mode="edit" blogSlug={slug as string} />;
};

export default EditBlogPage;
