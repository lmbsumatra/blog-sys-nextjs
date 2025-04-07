// CreateBlog2.tsx - A Next.js page for creating blog posts

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useAuthStore from "../../zustand-states/useAuthStore";
import useBlogPostStore from "../../zustand-states/useBlogPostStore";
import ImageUploader from "../../components/inputs/ImageUploader";
import AuthorCard from "../../components/author-card/AuthorCard";
import ListInput from "../../components/inputs/ListInput";
import { categories } from "../../components/constants";
import axios from "axios";

const create = () => {
  const { sections, addSection, setSectionField } = useBlogPostStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    // Mock data submission
    console.log("Submitting blog with sections:", sections);
    alert("Blog created successfully (mock)!");
    router.push("/");
  };

  const renderSection = (section: any) => {
    switch (section.type) {
      case "title":
        return (
          <input type="text" placeholder="Blog Title" className="w-full p-2 border" />
        );
      case "text":
        return (
          <textarea placeholder="Add text here..." className="w-full p-2 border" />
        );
      case "image":
        return <ImageUploader label="Upload Image" />;
      case "list":
        return <ListInput section={section} />;
      case "quote":
        return (
          <blockquote className="border-l-4 pl-4 italic">Add a quote...</blockquote>
        );
      case "category":
        return (
          <select className="border p-2">
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Create Blog</h1>
      {sections.map((section: any, index: number) => (
        <div key={index} className="mb-4">
          {renderSection(section)}
        </div>
      ))}

      <div className="my-4">
        <button onClick={() => addSection("title")} className="p-2 bg-blue-500 text-white">Add Title</button>
        <button onClick={() => addSection("text")} className="p-2 bg-blue-500 text-white ml-2">Add Text</button>
        <button onClick={() => addSection("image")} className="p-2 bg-blue-500 text-white ml-2">Add Image</button>
        <button onClick={() => addSection("list")} className="p-2 bg-blue-500 text-white ml-2">Add List</button>
        <button onClick={() => addSection("quote")} className="p-2 bg-blue-500 text-white ml-2">Add Quote</button>
        <button onClick={() => addSection("category")} className="p-2 bg-blue-500 text-white ml-2">Add Category</button>
      </div>

      <button onClick={handleSubmit} className="p-2 bg-green-500 text-white mt-4">Submit</button>
    </div>
  );
};

export default create;
