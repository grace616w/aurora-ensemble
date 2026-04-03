import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", elevated = false, children, ...props }, ref) => {
    const bg = elevated ? "bg-[#1A1A1A]" : "bg-[#141414]";
    return (
      <div
        ref={ref}
        className={`${bg} border border-white/[0.06] rounded-xl ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
export { Card };
