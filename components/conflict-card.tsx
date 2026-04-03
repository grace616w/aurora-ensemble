import { Card } from "./ui/card";
import { AlertTriangle } from "lucide-react";

interface ConflictCardProps {
  title: string;
  description: string;
  severity: "warning" | "error";
}

export function ConflictCard({ title, description, severity }: ConflictCardProps) {
  const color =
    severity === "error" ? "border-[#C75050]/20" : "border-[#A0784A]/20";
  const iconColor =
    severity === "error" ? "text-[#C75050]" : "text-[#A0784A]";
  const titleColor =
    severity === "error" ? "text-[#C75050]" : "text-[#A0784A]";

  return (
    <Card className={`p-4 ${color}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
        <div>
          <h4 className={`text-sm font-medium ${titleColor}`}>{title}</h4>
          <p className="text-xs text-white/40 mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
