import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryButtonProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick: () => void;
}

export default function CategoryButton({
  icon: Icon,
  label,
  count,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      data-testid={`button-${label.toLowerCase()}`}
      className="relative flex flex-col items-center justify-center h-32 bg-card border border-card-border rounded-md shadow-sm hover-elevate active-elevate-2 p-4"
    >
      {count !== undefined && count > 0 && (
        <Badge
          variant="default"
          className="absolute top-2 right-2 h-6 min-w-6 px-2"
        >
          {count}
        </Badge>
      )}
      <Icon className="w-8 h-8 text-primary mb-2" />
      <span className="text-base font-medium text-card-foreground text-center">
        {label}
      </span>
    </button>
  );
}
