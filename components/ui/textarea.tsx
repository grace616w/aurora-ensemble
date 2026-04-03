"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-medium uppercase tracking-[0.12em] text-white/50"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`bg-[#1A1A1A] border border-white/[0.06] rounded-md px-4 py-3 text-sm text-[#F5F5F5] placeholder:text-white/30 focus:outline-none focus:border-[#A0784A]/40 transition-colors duration-200 resize-none ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
