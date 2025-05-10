import { Button } from "@/src/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface SectionControlsProps {
  index: number;
  totalSections: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export const SectionControls = ({
  index,
  totalSections,
  onMoveUp,
  onMoveDown,
  onRemove,
}: SectionControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onMoveUp}
        disabled={index === 0}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onMoveDown}
        disabled={index === totalSections - 1}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onRemove}
      >
        Remove
      </Button>
    </div>
  );
};