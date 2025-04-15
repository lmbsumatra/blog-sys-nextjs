"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { blogValidator, contentValidator } from "@/src/lib/validations/blog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ButtonNavigation } from "../button/ButtonNavigation";
import { ArrowUp, ArrowDown, Image as ImageIcon } from "lucide-react";

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
      // slug: "",
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

  const bannerUrl = watch("banner");

  useEffect(() => {
    if (mode === "edit" && blogSlug) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs/${blogSlug}`, {
          withCredentials: true,
        })
        .then((res) => {
          const blogSections = res.data.blog;

          const editorContent = blogSections
            .filter((section: any) =>
              ["text", "header", "list", "image", "quote"].includes(
                section.sectionType
              )
            )
            .map((section: any, index: number) => {
              const value = section.content || "";
              switch (section.sectionType) {
                case "list":
                  return {
                    sectionType: "list",
                    content: Array.isArray(section.content)
                      ? section.content 
                      : section.content
                          .split("\n")
                          .map((item: any) => item.trim()), 
                    index,
                  };

                case "text":
                case "header":
                case "quote":
                  return {
                    sectionType: section.sectionType,
                    content: section.content,
                    index,
                  };
                case "image":
                  return {
                    sectionType: section.sectionType,
                    content: section.content.startsWith("http")
                      ? section.content
                      : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${section.content}`,
                    index,
                  };
                default:
                  throw new Error(
                    `Unknown sectionType: ${section.sectionType}`
                  );
              }
            });

          reset({
            title:
              blogSections.find((s: any) => s.sectionType === "title")
                ?.content || "",
            description:
              blogSections.find((s: any) => s.sectionType === "description")
                ?.content || "",
            banner:
              blogSections.find((s: any) => s.sectionType === "banner")
                ?.content || "",
            // slug:
            //   blogSections.find((s: any) => s.sectionType === "slug")
            //     ?.content || "",
            category: (() => {
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
              return allowed.includes(raw as Category)
                ? (raw as Category)
                : undefined;
            })(),
            content: editorContent,
          });

          const bannerContent = blogSections.find(
            (s: any) => s.sectionType === "banner"
          )?.content;
          if (bannerContent) {
            setBannerPreview(bannerContent);
          }

          editorContent.forEach((section: any, index: number) => {
            if (section.sectionType === "image" && section.content) {
              const imageUrl = section.content.startsWith("http")
                ? section.content
                : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${section.content}`;
              setSectionPreviews((prev) => ({ ...prev, [index]: imageUrl }));
            }
          });
        })

        .catch((err) => {
          console.error("Error fetching blog data:", err);
        });
    }
  }, [mode, blogSlug, reset]);

  const onSubmit = async (data: FormData) => {
    try {
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
      // formData.append("slug", data.slug);
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

      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      const url =
        mode === "create"
          ? `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs`
          : `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/blogs/${blogSlug}`;

      const method = mode === "create" ? "post" : "put";

      const response = await axios({
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

  const addSection = (type: FormData["content"][number]["sectionType"]) => {
    if (type === "list") {
      append({ sectionType: type, content: [""] }); 
    } else {
      append({ sectionType: type, content: "" });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);

      if (sectionImageFiles[index]) {
        const newSectionImageFiles = { ...sectionImageFiles };
        const tempFile = newSectionImageFiles[index];
        newSectionImageFiles[index] = newSectionImageFiles[index - 1];
        newSectionImageFiles[index - 1] = tempFile;
        setSectionImageFiles(newSectionImageFiles);
      }

      if (sectionPreviews[index]) {
        const newSectionPreviews = { ...sectionPreviews };
        const tempPreview = newSectionPreviews[index];
        newSectionPreviews[index] = newSectionPreviews[index - 1];
        newSectionPreviews[index - 1] = tempPreview;
        setSectionPreviews(newSectionPreviews);
      }
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);

      if (sectionImageFiles[index]) {
        const newSectionImageFiles = { ...sectionImageFiles };
        const tempFile = newSectionImageFiles[index];
        newSectionImageFiles[index] = newSectionImageFiles[index + 1];
        newSectionImageFiles[index + 1] = tempFile;
        setSectionImageFiles(newSectionImageFiles);
      }

      if (sectionPreviews[index]) {
        const newSectionPreviews = { ...sectionPreviews };
        const tempPreview = newSectionPreviews[index];
        newSectionPreviews[index] = newSectionPreviews[index + 1];
        newSectionPreviews[index + 1] = tempPreview;
        setSectionPreviews(newSectionPreviews);
      }
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerFile(file);

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);

    setValue("banner", file.name); 
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newSectionImageFiles = { ...sectionImageFiles };
    newSectionImageFiles[index] = file;
    setSectionImageFiles(newSectionImageFiles);

    const previewUrl = URL.createObjectURL(file);
    const newSectionPreviews = { ...sectionPreviews };
    newSectionPreviews[index] = previewUrl;
    setSectionPreviews(newSectionPreviews);

    setValue(`content.${index}.content`, file.name);
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview("");
    setValue("banner", "");
  };

  const removeImage = (index: number) => {
    const newSectionImageFiles = { ...sectionImageFiles };
    delete newSectionImageFiles[index];
    setSectionImageFiles(newSectionImageFiles);

    const newSectionPreviews = { ...sectionPreviews };
    delete newSectionPreviews[index];
    setSectionPreviews(newSectionPreviews);

    setValue(`content.${index}.content`, "");
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
            Banner Image
          </label>

          {bannerPreview ? (
            <div className="relative mt-2 mb-2">
              <img
                src={
                  bannerPreview.startsWith("http")
                    ? bannerPreview
                    : bannerFile
                    ? URL.createObjectURL(bannerFile)
                    : `${process.env.NEXT_PUBLIC_BASE_API_URL}/${bannerPreview}`
                }
                alt="Banner preview"
                className="w-full h-48 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={removeBanner}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div
              className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById("banner-upload")?.click()}
            >
              <ImageIcon className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Click to upload banner image
              </p>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerUpload}
              />
            </div>
          )}

          <Input
            id="banner-url"
            {...register("banner")}
            placeholder="Or enter a URL for the banner image"
            className="mt-2"
            onChange={(e) => {
              setValue("banner", e.target.value);
              if (e.target.value.startsWith("http")) {
                setBannerPreview(e.target.value);
                setBannerFile(null);
              }
            }}
          />
          {errors.banner && (
            <p className="text-sm text-red-500">{errors.banner.message}</p>
          )}
        </div>

        {/* <div>
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
        </div> */}

        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Gadgets">Gadgets</SelectItem>
                  <SelectItem value="Documents">Documents</SelectItem>
                  <SelectItem value="ID">ID</SelectItem>
                  <SelectItem value="Wearables">Wearables</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="School Materials">
                    School Materials
                  </SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const contentValue = watch(`content.${index}.content`);

          return (
            <div
              key={field.id}
              className="border p-4 rounded-md space-y-2 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium capitalize">{field.sectionType}</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === fields.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {field.sectionType === "text" ||
              field.sectionType === "header" ||
              field.sectionType === "quote" ? (
                <Controller
                  name={`content.${index}.content`}
                  control={control}
                  render={({ field: controllerField }: { field: any }) => (
                    <Textarea
                      {...controllerField}
                      placeholder={`Enter ${controllerField.sectionType}`}
                    />
                  )}
                />
              ) : field.sectionType === "image" ? (
                <div>
                  {sectionPreviews[index] ? (
                    <div className="relative mt-2 mb-2">
                      <img
                        src={
                          sectionPreviews[index]?.startsWith("http")
                            ? sectionPreviews[index]
                            : `${sectionPreviews[index]}`
                        }
                        alt="Section image"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                      onClick={() =>
                        document
                          .getElementById(`image-upload-${index}`)
                          ?.click()
                      }
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Click to upload image
                      </p>
                      <input
                        id={`image-upload-${index}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, index)}
                      />
                    </div>
                  )}
                  <Controller
                    name={`content.${index}.content`}
                    control={control}
                    render={({ field: controllerField }: { field: any }) => (
                      <Input
                        {...controllerField}
                        placeholder="Or enter image URL"
                        className="mt-2"
                        onChange={(e) => {
                          setValue(`content.${index}.content`, e.target.value);
                          if (e.target.value.startsWith("http")) {
                            const newPreviews = { ...sectionPreviews };
                            newPreviews[index] = e.target.value;
                            setSectionPreviews(newPreviews);

                            const newFiles = { ...sectionImageFiles };
                            delete newFiles[index];
                            setSectionImageFiles(newFiles);
                          }
                        }}
                      />
                    )}
                  />
                </div>
              ) : field.sectionType === "list" ? (
                <Controller
                  name={`content.${index}.content`}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Textarea
                      value={
                        Array.isArray(controllerField.value)
                          ? controllerField.value.join("\n")
                          : ""
                      }
                      placeholder="Enter list items separated by new lines"
                      onChange={(e) => {
                        const items = e.target.value
                          .split("\n")
                          .filter((item) => item.trim() !== "");
                        setValue(
                          `content.${index}.content`,
                          items.length > 0 ? items : [""]
                        );
                      }}
                    />
                  )}
                />
              ) : null}

              {errors.content && errors.content[index]?.content && (
                <p className="text-sm text-red-500">
                  {typeof errors.content[index]?.content === "object"
                    ? errors.content[index]?.content?.message || "Invalid input"
                    : String(errors.content[index]?.content)}
                </p>
              )}
            </div>
          );
        })}
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

      <Button type="submit" disabled={isSubmitting}>
        {mode === "create" ? "Create Blog" : "Update Blog"}
      </Button>
    </form>
  );
};

export default CreateEditBlog;
