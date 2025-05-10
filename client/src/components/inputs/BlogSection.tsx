import { Control, Controller, FieldError, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Textarea } from "@/src/components/ui/textarea";
import { SectionControls } from "./SectionControls";
import { ImageUpload } from "./ImageUpload";

interface BaseSectionProps {
  index: number;
  sectionType: string;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  error?: FieldError;
  totalSections: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
}

interface ImageSectionProps extends BaseSectionProps {
  sectionImageFiles: Record<number, File>;
  sectionPreviews: Record<number, string>;
  setSectionImageFiles: (files: Record<number, File>) => void;
  setSectionPreviews: (previews: Record<number, string>) => void;
  baseUrl?: string;
}

export const BlogSection = (props: BaseSectionProps | ImageSectionProps) => {
  const { 
    index, 
    sectionType, 
    control, 
    setValue, 
    watch, 
    error, 
    totalSections, 
    onMoveUp, 
    onMoveDown, 
    onRemove 
  } = props;

  return (
    <div className="border p-4 rounded-md space-y-2 bg-gray-50">
      <div className="flex justify-between items-center">
        <p className="font-medium capitalize">{sectionType}</p>
        <SectionControls
          index={index}
          totalSections={totalSections}
          onMoveUp={() => onMoveUp(index)}
          onMoveDown={() => onMoveDown(index)}
          onRemove={() => onRemove(index)}
        />
      </div>

      {renderSectionContent(props)}

      {error && (
        <p className="text-sm text-red-500">
          {typeof error === "object" ? error.message || "Invalid input" : String(error)}
        </p>
      )}
    </div>
  );
};

const renderSectionContent = (props: BaseSectionProps | ImageSectionProps) => {
  const { index, sectionType, control, setValue, watch } = props;

  switch (sectionType) {
    case "text":
    case "header":
    case "quote":
      return (
        <Controller
          name={`content.${index}.content`}
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder={`Enter ${sectionType}`} />
          )}
        />
      );
    case "list":
      return (
        <Controller
          name={`content.${index}.content`}
          control={control}
          render={({ field }) => (
            <Textarea
              value={Array.isArray(field.value) ? field.value.join("\n") : ""}
              placeholder="Enter list items separated by new lines"
              onChange={(e) => {
                const items = e.target.value
                  .split("\n")
                  .filter((item) => item.trim() !== "");
                setValue(`content.${index}.content`, items.length > 0 ? items : [""]);
              }}
            />
          )}
        />
      );
    case "image":
      if ('sectionImageFiles' in props) {
        const { 
          sectionImageFiles, 
          sectionPreviews, 
          setSectionImageFiles, 
          setSectionPreviews,
          baseUrl = ""
        } = props;
        
        return (
          <Controller
            name={`content.${index}.content`}
            control={control}
            render={({ field }) => (
              <ImageUpload
                value={field.value}
                preview={sectionPreviews[index] || ""}
                onChange={(value) => {
                  setValue(`content.${index}.content`, value);
                  if (value.startsWith("http")) {
                    const newPreviews = { ...sectionPreviews };
                    newPreviews[index] = value;
                    setSectionPreviews(newPreviews);

                    const newFiles = { ...sectionImageFiles };
                    delete newFiles[index];
                    setSectionImageFiles(newFiles);
                  }
                }}
                onFileChange={(file) => {
                  if (!file) return;
                  const newFiles = { ...sectionImageFiles };
                  newFiles[index] = file;
                  setSectionImageFiles(newFiles);

                  const previewUrl = URL.createObjectURL(file);
                  const newPreviews = { ...sectionPreviews };
                  newPreviews[index] = previewUrl;
                  setSectionPreviews(newPreviews);
                }}
                onRemove={() => {
                  const newFiles = { ...sectionImageFiles };
                  delete newFiles[index];
                  setSectionImageFiles(newFiles);

                  const newPreviews = { ...sectionPreviews };
                  delete newPreviews[index];
                  setSectionPreviews(newPreviews);

                  setValue(`content.${index}.content`, "");
                }}
                baseUrl={baseUrl}
              />
            )}
          />
        );
      }
      return null;
    default:
      return null;
  }
};