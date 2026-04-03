import { HTMLAttributes, forwardRef } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "success" | "warning" | "error";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-white/10 text-white/70",
      gold: "bg-[#A0784A]/15 text-[#A0784A]",
      success: "bg-[#4CAF7C]/15 text-[#4CAF7C]",
      warning: "bg-[#A0784A]/15 text-[#A0784A]",
      error: "bg-[#C75050]/15 text-[#C75050]",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
export { Badge };
