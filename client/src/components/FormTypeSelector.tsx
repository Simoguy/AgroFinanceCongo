import { Badge } from "@/components/ui/badge";

interface FormType {
  id: string;
  label: string;
}

interface FormTypeSelectorProps {
  types: FormType[];
  selectedType: string;
  onTypeChange: (typeId: string) => void;
}

export default function FormTypeSelector({
  types,
  selectedType,
  onTypeChange,
}: FormTypeSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeChange(type.id)}
          data-testid={`type-${type.id}`}
          className="toggle-elevate toggle-elevated"
        >
          <Badge
            variant={selectedType === type.id ? "default" : "secondary"}
            className="h-9 px-4 cursor-pointer no-default-hover-elevate no-default-active-elevate"
          >
            {type.label}
          </Badge>
        </button>
      ))}
    </div>
  );
}
