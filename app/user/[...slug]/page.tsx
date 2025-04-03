"use client";

import AuthorCard from "@/app/components/author-card/page";
import NavBar from "@/app/components/navbar/page";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface ErrorResponse {
  message: string | null;
}

// Mock Data
const mockBlog = [
  {
    id: 1,
    sectionType: "banner",
    value: "/images/sample-banner.jpg",
  },
  {
    id: 2,
    sectionType: "title",
    value: "This is a Sample Blog Title",
  },
  {
    id: 3,
    sectionType: "header",
    value: "Sample Blog Header",
  },
  {
    id: 4,
    sectionType: "text",
    value: "This is a sample text content of the blog.",
  },
  {
    id: 5,
    sectionType: "quote",
    value: "This is a sample quote for the blog.",
  },
  {
    id: 6,
    sectionType: "list",
    value: "First item\nSecond item\nThird item",
  },
];

const mockUser = {
  name: "John Doe",
  avatar: "/images/author-avatar.jpg",
};

const Blog = () => {
  const router = useRouter();
  const slug = "sample-slug";

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const isLoading = false;
  const error: ErrorResponse | null = null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-2xl font-semibold text-red-600">
          {/* Error: {error.message} */}
        </div>
      </div>
    );
  }

  const blog = mockBlog;
  const user = mockUser;

  const handleNavigation = (nav: "back") => {
    if (nav === "back") {
      router.push("/");
    }
  };

  const renderSection = (section: any) => {
    switch (section.sectionType) {
      case "banner":
      case "image":
        return (
          <div
            key={section.id}
            className="w-full max-h-[400px] overflow-hidden rounded-lg"
          >
            <img
              src={section.value}
              alt="Blog section"
              className="w-full h-auto aspect-[16/9] object-cover rounded-lg"
            />
          </div>
        );
      case "header":
        return (
          <h1
            key={section.id}
            className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            {section.value}
          </h1>
        );
      case "title":
        return (
          <h1
            key={section.id}
            className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            {section.value}
          </h1>
        );
      case "description":
        return (
          <p key={section.id} className="text-xl text-gray-700 dark:text-gray-300 mb-4">
            {section.value}
          </p>
        );
      case "text":
        return (
          <p key={section.id} className="text-base text-gray-800 dark:text-gray-200 mb-4">
            {section.value}
          </p>
        );
      case "quote":
        return (
          <blockquote
            key={section.id}
            className="border-l-4 border-blue-500 pl-6 italic text-gray-900 dark:text-gray-200"
          >
            {section.value}
          </blockquote>
        );
      case "list":
        return (
          <ul key={section.id} className="list-disc pl-4 text-gray-900 dark:text-gray-200">
            {section.value.split("\n").map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <NavBar />
      <div className="container mx-auto p-8">
        <article className="bg-white dark:bg-gray-800 shadow rounded p-8 space-y-6">
          {blog.slice(0, 3).map(renderSection)}
          <AuthorCard author={user} />
          {blog.slice(3).map(renderSection)}
        </article>
      </div>
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-5 right-5 p-3 bg-gray-800 text-white rounded-full"
      >
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
    </div>
  );
};

export default Blog;
