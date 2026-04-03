"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, id, options, ...props }, ref) => {
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
        <select
          ref={ref}
          id={id}
          className={`bg-[#1A1A1A] border border-white/[0.06] rounded-md px-4 py-2.5 text-sm text-[#F5F5F5] focus:outline-none focus:border-[#A0784A]/40 transition-colors duration-200 appearance-none ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
