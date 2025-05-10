import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  preview: string;
  onChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
  placeholder?: string;
  baseUrl?: string;
}

export const ImageUpload = ({
  value,
  preview,
  onChange,
  onFileChange,
  onRemove,
  placeholder = "Click to upload image",
  baseUrl = "",
}: ImageUploadProps) => {
  const uploadId = `image-upload-${Math.random().toString(36).substring(2, 9)}`;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileChange(file);
    onChange(file.name);
  };

  return (
    <div>
      {preview ? (
        <div className="relative mt-2 mb-2">
          <img
            src={
              preview.startsWith("http")
                ? preview
                : `${baseUrl}/${preview}`
            }
            alt="Image preview"
            className="w-full h-48 object-cover rounded-md"
          />
          <Button
            type="button"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            Remove
          </Button>
        </div>
      ) : (
        <div
          className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={() => document.getElementById(uploadId)?.click()}
        >
          <ImageIcon className="h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">{placeholder}</p>
          <input
            id={uploadId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      )}
      <Input
        value={value}
        placeholder="Or enter image URL"
        className="mt-2"
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};