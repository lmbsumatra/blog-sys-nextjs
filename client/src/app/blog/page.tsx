"use client";

import { ButtonNavigation } from "@/src/components/button/ButtonNavigation";
import { Button } from "@/src/components/ui/button";
import { useDeleteBlogBySlug } from "@/src/hooks/useDeleteBySlug";
import { useFetchBlogs } from "@/src/hooks/useFetchBlogs";
import formatDate from "@/src/lib/helpers/formatDate";
import { isImageURL } from "@/src/lib/helpers/isImageUrl";
import useAuthStore from "@/src/store/useAuthStore";
import Link from "next/link";


const User = () => {
  const { user } = useAuthStore();

  const { data: blogs, error, isLoading, isError } = useFetchBlogs();
  const { mutate: deleteBlog, isError: deleteError } = useDeleteBlogBySlug();

  const handleDelete = (slug: string) => {
    // if (isDeleting) return;
    deleteBlog(slug);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }


  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Welcome, {user?.firstName}!</h2>
          <ButtonNavigation label="Create Blog" path={`/create`} />
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Your Profile Information
          </h3>
          <ul>
            {user &&
              Object.entries(user).map(([key, value]) => (
                <li key={key} className="mb-1">
                  <strong>{key}:</strong> {value as any}
                </li>
              ))}
          </ul>
        </div>

        {blogs?.map((blog: any) => (
          <div
            key={blog.id}
            className="bg-white dark:bg-gray-800 rounded p-4 mb-8 flex flex-col"
          >
            <div className="mx-5 my-2 p-2 flex gap-2 items-center">
              <div>
                <img
                  src={
                    isImageURL(blog.banner)
                      ? `${blog.banner}`
                      : `http://localhost:3001/${blog.banner}` || "default"
                  }
                  alt="User icon"
                  className="bg-gray-500 rounded-full h-[40px] w-[40px]"
                />
              </div>
              <div>
                <span className="font-semibold">
                  {blog.user.firstName} {blog.user.lastName}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div className="px-5 py-1">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {blog.title}
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-300">
                  {blog.description || "No description available."}
                </p>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                  Read more
                  <svg
                    className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </Link>
                <ButtonNavigation
                  label="Edit Blog"
                  path={`/edit/${blog.slug}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDelete(blog.slug)}
                >
                  Delete
                </Button>
              </div>

              <div className="h-36 w-48 rounded overflow-hidden shadow-md">
                <img
                  className="w-full h-full object-cover"
                  src={
                    isImageURL(blog.banner)
                      ? `${blog.banner}`
                      : `http://localhost:3001/${blog.banner}` || "default"
                  }
                  alt="Blog Banner"
                />
              </div>
            </div>

            <div className="px-4 pt-2 flex items-center gap-4">
              <span className="py-1 px-2 rounded-full bg-gray-100 dark:bg-gray-700">
                {blog.category}
              </span>
              <span>{formatDate(new Date(blog.createdAt))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
