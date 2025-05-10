"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { blogValidator, contentValidator } from "@/src/lib/validations/blog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { ButtonNavigation } from "../button/ButtonNavigation";

// Import our custom components
import { FormField } from "../inputs/FormField";
import { ImageUpload } from "../inputs/ImageUpload";
import { BlogSection } from "../inputs/BlogSection";
import { AddSectionButtons } from "../inputs/AddSectionButtons";
import { CategorySelect } from "../inputs/CategorySelect";

type Category =
  | "Personal"
  | "Electronics"
  | "Gadgets"
  | "Documents"
  | "ID"
  | "Wearables"
  | "Accessories"
  | "Clothing"
  | "School Materials"
  | "Others";

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
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(fullValidator),
    defaultValues: {
      title: "",
      description: "",
      banner: "",
      category: "Personal",
      content: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "content",
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [sectionImageFiles, setSectionImageFiles] = useState<
    Record<number, File>
  >({});
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [sectionPreviews, setSectionPreviews] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    if (mode === "edit" && blogSlug) {
      fetchBlogData();
    }
  }, [mode, blogSlug]);

  const fetchBlogData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs/${blogSlug}`,
        { withCredentials: true }
      );

      const blogSections = res.data.blog;
      processBlogData(blogSections);
    } catch (err) {
      console.error("Error fetching blog data:", err);
    }
  };

  const processBlogData = (blogSections: any[]) => {
    const editorContent = blogSections
      .filter((section: any) =>
        ["text", "header", "list", "image", "quote"].includes(
          section.sectionType
        )
      )
      .map((section: any, index: number) => {
        switch (section.sectionType) {
          case "list":
            return {
              sectionType: "list",
              content: Array.isArray(section.content)
                ? section.content
                : section.content.split("\n").map((item: any) => item.trim()),
              index,
            };
          case "image":
            return {
              sectionType: "image",
              content: section.content.startsWith("http")
                ? section.content
                : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${section.content}`,
              index,
            };
          default:
            return {
              sectionType: section.sectionType,
              content: section.content,
              index,
            };
        }
      });

    reset({
      title:
        blogSections.find((s: any) => s.sectionType === "title")?.content || "",
      description:
        blogSections.find((s: any) => s.sectionType === "description")
          ?.content || "",
      banner:
        blogSections.find((s: any) => s.sectionType === "banner")?.content ||
        "",
      category: getCategory(blogSections),
      content: editorContent,
    });

    const bannerContent = blogSections.find(
      (s: any) => s.sectionType === "banner"
    )?.content;
    if (bannerContent) {
      setBannerPreview(bannerContent);
    }

    const newSectionPreviews = { ...sectionPreviews };
    editorContent.forEach((section: any, index: number) => {
      if (section.sectionType === "image" && section.content) {
        newSectionPreviews[index] = section.content;
      }
    });
    setSectionPreviews(newSectionPreviews);
  };

  const getCategory = (blogSections: any[]): Category => {
    const raw = blogSections.find(
      (s: any) => s.sectionType === "category"
    )?.content;
    const allowed: Category[] = [
      "Personal",
      "Electronics",
      "Gadgets",
      "Documents",
      "ID",
      "Wearables",
      "Accessories",
      "Clothing",
      "School Materials",
      "Others",
    ];
    return allowed.includes(raw as Category) ? (raw as Category) : "Personal";
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = prepareFormData(data);

      const url =
        mode === "create"
          ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs`
          : `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs/${blogSlug}`;

      const method = mode === "create" ? "post" : "put";

      await axios({
        method,
        url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert(
        mode === "create"
          ? "Blog created successfully!"
          : "Blog updated successfully!"
      );
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting blog. Please check the console for details.");
    }
  };

  const prepareFormData = (data: FormData) => {
    const formData = new FormData();

    if (bannerFile) {
      formData.append("banner", bannerFile);
    } else if (data.banner) {
      formData.append("banner", data.banner);
    }

    Object.entries(sectionImageFiles).forEach(([index, file]) => {
      formData.append("sectionImages", file);
    });

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);

    const processedContent = data.content.map((section, idx) => {
      if (section.sectionType === "image" && sectionImageFiles[idx]) {
        return {
          ...section,
          content: `[FILE_UPLOAD_${idx}]`,
        };
      }

      if (section.sectionType === "list") {
        return {
          ...section,
          content: Array.isArray(section.content)
            ? section.content.join("\n")
            : section.content,
        };
      }

      return section;
    });

    formData.append("content", JSON.stringify(processedContent));
    return formData;
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);

      setTimeout(() => {
        const newSectionImageFiles = { ...sectionImageFiles };
        const newSectionPreviews = { ...sectionPreviews };

        const tempFile = newSectionImageFiles[index];
        newSectionImageFiles[index] = newSectionImageFiles[index - 1];
        newSectionImageFiles[index - 1] = tempFile;

        const tempPreview = newSectionPreviews[index];
        newSectionPreviews[index] = newSectionPreviews[index - 1];
        newSectionPreviews[index - 1] = tempPreview;

        setSectionImageFiles(newSectionImageFiles);
        setSectionPreviews(newSectionPreviews);
      }, 0);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);

      const newSectionImageFiles: Record<number, File> = {};
      const newSectionPreviews: Record<number, string> = {};

      Object.entries(sectionImageFiles).forEach(([idx, file]) => {
        const numIdx = Number(idx);
        if (numIdx !== index && numIdx !== index + 1) {
          newSectionImageFiles[numIdx] = file;
        }
      });

      Object.entries(sectionPreviews).forEach(([idx, preview]) => {
        const numIdx = Number(idx);
        if (numIdx !== index && numIdx !== index + 1) {
          newSectionPreviews[numIdx] = preview;
        }
      });

      if (sectionImageFiles[index])
        newSectionImageFiles[index + 1] = sectionImageFiles[index];
      if (sectionImageFiles[index + 1])
        newSectionImageFiles[index] = sectionImageFiles[index + 1];

      if (sectionPreviews[index])
        newSectionPreviews[index + 1] = sectionPreviews[index];
      if (sectionPreviews[index + 1])
        newSectionPreviews[index] = sectionPreviews[index + 1];

      setSectionImageFiles(newSectionImageFiles);
      setSectionPreviews(newSectionPreviews);
    }
  };

  const addSection = (type: FormData["content"][number]["sectionType"]) => {
    if (type === "list") {
      append({ sectionType: type, content: [""] });
    } else {
      append({ sectionType: type, content: "" });
    }
  };

  useEffect(() => {
    console.log("Current form errors:", errors);
  }, [errors]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      encType="multipart/form-data"
    >
      <ButtonNavigation label="Back" path={`/`} />

      <div className="space-y-4">
        <FormField id="title" label="Title" error={errors.title}>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter the title of your blog"
          />
        </FormField>

        <FormField
          id="description"
          label="Description"
          error={errors.description}
        >
          <Textarea
            id="description"
            {...register("description")}
            placeholder="Enter a description for your blog"
          />
        </FormField>

        <FormField id="banner" label="Banner Image" error={errors.banner}>
          <ImageUpload
            value={watch("banner") ?? ""}
            preview={bannerPreview}
            onChange={(value) => setValue("banner", value)}
            onFileChange={(file) => {
              setBannerFile(file);
              if (file) {
                const previewUrl = URL.createObjectURL(file);
                setBannerPreview(previewUrl);
              }
            }}
            onRemove={() => {
              setBannerFile(null);
              setBannerPreview("");
              setValue("banner", "");
            }}
            placeholder="Click to upload banner image"
            baseUrl={process.env.NEXT_PUBLIC_BASE_API_URL}
          />
        </FormField>

        <FormField id="category" label="Category" error={errors.category}>
          <CategorySelect control={control} />
        </FormField>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <BlogSection
            key={field.id}
            index={index}
            sectionType={field.sectionType}
            control={control}
            setValue={setValue}
            watch={watch}
            error={
              errors.content?.[index]
                ? Array.isArray(errors.content[index])
                  ? errors.content[index][0]
                  : errors.content[index]
                : undefined
            }
            totalSections={fields.length}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onRemove={remove}
            sectionImageFiles={sectionImageFiles}
            sectionPreviews={sectionPreviews}
            setSectionImageFiles={setSectionImageFiles}
            setSectionPreviews={setSectionPreviews}
            baseUrl={
              process.env.NEXT_PUBLIC_BASE_API_URL ?? `http://localhost:3001`
            }
          />
        ))}
      </div>

      <AddSectionButtons
        onAddSection={(type: string) =>
          addSection(type as FormData["content"][number]["sectionType"])
        }
      />

      <Button type="submit" disabled={isSubmitting}>
        {mode === "create" ? "Create Blog" : "Update Blog"}
      </Button>
    </form>
  );
};

export default CreateEditBlog;
