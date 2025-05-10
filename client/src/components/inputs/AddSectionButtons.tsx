import { Button } from "@/src/components/ui/button";

interface AddSectionButtonsProps {
 onAddSection: <T extends string>(type: T) => void;
}

export const AddSectionButtons = ({ onAddSection }: AddSectionButtonsProps) => {
  const sectionTypes = ["text", "header", "quote", "image", "list"];
  
  return (
    <div className="space-y-4">
      {sectionTypes.map((type) => (
        <Button
          key={type}
          type="button"
          variant="outline"
          onClick={() => onAddSection(type)}
        >
          Add {type.charAt(0).toUpperCase() + type.slice(1)} Section
        </Button>
      ))}
    </div>
  );
};
