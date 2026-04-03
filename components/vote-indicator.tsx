"use client";

import { Check, X } from "lucide-react";
import { Vote } from "@/lib/types";

interface CompactVoteProps {
  initials: string;
  isMember: boolean;
  vote: Vote;
  onToggle: () => void;
}

export function CompactVote({ initials, isMember, vote, onToggle }: CompactVoteProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-200 cursor-pointer relative ${
        vote === "up"
          ? "bg-[#4CAF7C]/20 text-[#4CAF7C] ring-1 ring-[#4CAF7C]/30"
          : vote === "down"
          ? "bg-[#C75050]/20 text-[#C75050] ring-1 ring-[#C75050]/30"
          : isMember
          ? "bg-[#A0784A]/10 text-[#A0784A]/60 ring-1 ring-white/10 hover:ring-white/20"
          : "bg-white/5 text-white/40 ring-1 ring-white/10 hover:ring-white/20"
      }`}
      title={`${initials}: tap to vote`}
    >
      {vote === "up" ? (
        <Check className="w-3 h-3" />
      ) : vote === "down" ? (
        <X className="w-3 h-3" />
      ) : (
        initials
      )}
    </button>
  );
}
