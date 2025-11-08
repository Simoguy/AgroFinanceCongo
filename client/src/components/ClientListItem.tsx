import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";

interface ClientListItemProps {
  name: string;
  phone: string;
  amount: string;
  status: "active" | "warning" | "settled";
  onClick: () => void;
}

export default function ClientListItem({
  name,
  phone,
  amount,
  status,
  onClick,
}: ClientListItemProps) {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "text-primary";
      case "warning":
        return "text-destructive";
      case "settled":
        return "text-muted-foreground";
      default:
        return "text-foreground";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <button
      onClick={onClick}
      data-testid={`client-${name.toLowerCase().replace(/\s+/g, "-")}`}
      className="w-full flex items-center gap-3 p-4 hover-elevate active-elevate-2 rounded-md"
    >
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left min-w-0">
        <p className="text-base font-medium text-card-foreground truncate">
          {name}
        </p>
        <p className="text-sm text-muted-foreground truncate">{phone}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-bold tabular-nums ${getStatusColor()}`}>
          {amount}
        </span>
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </button>
  );
}
