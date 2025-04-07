"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import axios from "axios";
import { blogValidator, contentValidator } from "@/lib/validations/blog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fullValidator = blogValidator.extend({
  content: contentValidator,
});

type FormData = z.infer<typeof fullValidator>;

interface CreateEditBlogProps {
  mode: "create" | "edit";
  blogSlug?: string;
}

const CreateEditBlog = ({ mode, blogSlug }: CreateEditBlogProps) => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(fullValidator),
    defaultValues: {
      title: "",
      description: "",
      banner: "",
      slug: "",
      category: "Personal",
      content: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "content",
  });

  useEffect(() => {
    if (mode === "edit" && blogSlug) {
      axios.get(`/api/blogs/${blogSlug}`).then((res) => {
        const blog = res.data;
        reset({
          title: blog.title,
          description: blog.description,
          banner: blog.banner,
          slug: blog.slug,
          category: blog.category,
          content: blog.content || [],
        });
      });
    }
  }, [mode, blogSlug, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (mode === "create") {
        await axios.post("/api/blogs", data);
        alert("Blog created");
      } else {
        await axios.put(`/api/blogs/${blogSlug}`, data);
        alert("Blog updated");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const addSection = (type: FormData["content"][number]["sectionType"]) => {
    if (type === "list") {
      append({ sectionType: type, content: [""] });
    } else {
      append({ sectionType: type, content: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Blog form fields (title, description, etc.) */}
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter the title of your blog"
            className="mt-1"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter a description for your blog"
            className="mt-1"
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="banner" className="block text-sm font-medium">
            Banner Image URL
          </label>
          <Input
            id="banner"
            {...register("banner")}
            placeholder="Enter a URL for the banner image"
            className="mt-1"
          />
          {errors.banner && (
            <p className="text-sm text-red-500">{errors.banner.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium">
            Slug
          </label>
          <Input
            id="slug"
            {...register("slug")}
            placeholder="Enter a slug for your blog"
            className="mt-1"
          />
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <Select {...register("category")}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => addSection("text")}
        >
          Add Text Section
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => addSection("header")}
        >
          Add Header Section
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => addSection("quote")}
        >
          Add Quote Section
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => addSection("image")}
        >
          Add Image Section
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => addSection("list")}
        >
          Add List Section
        </Button>
      </div>

      {/* Dynamic Sections */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-md space-y-2 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium capitalize">{field.sectionType}</p>
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>

            {/* Conditionally render input fields based on section type */}
            {field.sectionType === "text" ||
            field.sectionType === "header" ||
            field.sectionType === "quote" ||
            field.sectionType === "image" ? (
              <Controller
                name={`content.${index}.content`}
                control={control}
                render={({ field }: { field: any }) => (
                  <Textarea
                    {...field}
                    placeholder={`Enter ${field.sectionType}`}
                  />
                )}
              />
            ) : field.sectionType === "list" ? (
              <Controller
                name={`content.${index}.content`}
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Enter list items separated by new lines"
                    onChange={(e) =>
                      setValue(
                        `content.${index}.content`,
                        e.target.value.split("\n")
                      )
                    }
                  />
                )}
              />
            ) : null}

            {/* Display validation errors for content */}
            {errors.content && errors.content[index]?.content && (
              <p className="text-sm text-red-500">
                {typeof errors.content[index]?.content === "object"
                  ? errors.content[index]?.content?.message || "Invalid input"
                  : String(errors.content[index]?.content)}
              </p>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  );
};

export default CreateEditBlog;
