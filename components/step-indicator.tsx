"use client";

import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            {i > 0 && (
              <div
                className={`w-8 h-px ${
                  isCompleted ? "bg-[#A0784A]" : "bg-white/10"
                }`}
              />
            )}
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#A0784A] text-[#0A0A0A]"
                    : isCompleted
                    ? "bg-[#A0784A]/20 text-[#A0784A]"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  isActive
                    ? "text-[#F5F5F5]"
                    : isCompleted
                    ? "text-white/50"
                    : "text-white/30"
                }`}
              >
                {step}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
