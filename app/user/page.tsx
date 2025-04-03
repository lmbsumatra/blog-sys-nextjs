"use client";

import useAuthStore from "../store/useAuthStore";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useFetchBlogs } from "../hooks/useFetchBlogs";


const User = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const { data: blogs } = useFetchBlogs(); 

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Welcome, {user?.firstName}!</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Your Profile Information
          </h3>
          <ul>
            {user &&
              Object.entries(user).map(([key, value]) => (
                <li key={key} className="mb-1">
                  <strong>{key}:</strong> {value}
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
                  src=""
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
                <a
                  href={`/blogs/${blog.slug}`}
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
                </a>
              </div>

              <div className="h-36 w-48 rounded overflow-hidden shadow-md">
                <img
                  className="w-full h-full object-cover"
                  src={
                    blog.banner ||
                    "https://images.pexels.com/photos/4021773/pexels-photo-4021773.jpeg"
                  }
                  alt="Blog Banner"
                />
              </div>
            </div>

            <div className="px-4 pt-2 flex items-center gap-4">
              <span className="py-1 px-2 rounded-full bg-gray-100 dark:bg-gray-700">
                {blog.category}
              </span>
              <span>{blog.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
