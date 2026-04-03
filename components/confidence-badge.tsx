interface ConfidenceBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function ConfidenceBadge({ score, size = "md" }: ConfidenceBadgeProps) {
  const color =
    score >= 80
      ? "text-[#4CAF7C] bg-[#4CAF7C]/10 border-[#4CAF7C]/20"
      : score >= 60
      ? "text-[#A0784A] bg-[#A0784A]/10 border-[#A0784A]/20"
      : "text-[#C75050] bg-[#C75050]/10 border-[#C75050]/20";

  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border ${color} ${sizeClass}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          score >= 80
            ? "bg-[#4CAF7C]"
            : score >= 60
            ? "bg-[#A0784A]"
            : "bg-[#C75050]"
        }`}
      />
      {score}
    </span>
  );
}
