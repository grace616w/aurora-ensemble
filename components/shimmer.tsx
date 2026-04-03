"use client";

import { motion } from "framer-motion";

export function ShimmerBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-[#141414] ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}

export function ReconciliationSkeleton() {
  return (
    <div className="space-y-6">
      {/* Group analysis skeleton */}
      <div className="space-y-3">
        <ShimmerBlock className="h-6 w-48" />
        <ShimmerBlock className="h-20 w-full" />
      </div>

      {/* Venue cards skeleton */}
      {[1, 2, 3].map((i) => (
        <ShimmerBlock key={i} className="h-40 w-full" />
      ))}
    </div>
  );
}
