"use client";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { PhoneCall, ArrowRight } from "lucide-react";

interface HandoffBannerProps {
  reason: string;
  context?: string;
}

export function HandoffBanner({ reason, context }: HandoffBannerProps) {
  return (
    <Card className="p-6 border-[#A0784A]/20 bg-[#A0784A]/[0.03]">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#A0784A]/10 flex items-center justify-center shrink-0">
          <PhoneCall className="w-5 h-5 text-[#A0784A]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-[#A0784A] mb-1">
            Lifestyle Strategist Recommended
          </h3>
          <p className="text-sm text-white/50 leading-relaxed mb-3">
            {reason}
          </p>
          {context && (
            <div className="bg-[#0A0A0A] rounded-lg p-4 mb-4 border border-white/[0.06]">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/30 mb-2">
                Pre-packaged briefing
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                {context}
              </p>
            </div>
          )}
          <Button variant="primary" size="md">
            Connect Lifestyle Strategist
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
