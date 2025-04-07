'use client';

import CreateEditBlog from "@/app/components/blogs/CreateEditBlog";
import { useParams } from "next/navigation";

const CreateBlogPage = () => {
  const { slug } = useParams();

  return <CreateEditBlog mode="create" blogSlug={slug as string} />;
};

export default CreateBlogPage;
