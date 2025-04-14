"use client";
import { useDeleteBlogBySlug } from "@/src/hooks/useDeleteBySlug";
import { useFetchBlogs } from "@/src/hooks/useFetchBlogs";
import useAuthStore from "@/src/store/useAuthStore";
import { useRouter } from "next/navigation";
import { BlogCard } from "@/src/components/blog-card/page";

const Home = () => {
  const { user } = useAuthStore();
  const { data: blogs, error, isLoading, isError } = useFetchBlogs();
  const { mutate: deleteBlog, isError: deleteError } = useDeleteBlogBySlug();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200">
      <div className="container mx-auto px-[5%] py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Profile
          </h2>
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          {blogs?.map((blog: any) => (
            <BlogCard blog={blog} isYou={true}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
