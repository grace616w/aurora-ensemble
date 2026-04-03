"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

    const variants = {
      primary:
        "bg-[#A0784A] text-[#0A0A0A] hover:bg-[#B8913F] active:bg-[#8F6B3D]",
      secondary:
        "bg-transparent border border-white/10 text-[#F5F5F5] hover:border-white/20 hover:bg-white/5",
      ghost:
        "bg-transparent text-white/50 hover:text-[#F5F5F5] hover:bg-white/5",
    };

    const sizes = {
      sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
      md: "text-sm px-5 py-2.5 rounded-lg gap-2",
      lg: "text-base px-7 py-3 rounded-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
