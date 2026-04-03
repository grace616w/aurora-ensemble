"use client";

import { DisruptionScenario } from "@/lib/types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ConfidenceBadge } from "./confidence-badge";
import { AlertTriangle, Zap, PhoneCall, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

type Phase = "idle" | "detecting" | "impact" | "options" | "briefing";

interface DisruptionSimulatorProps {
  scenario: DisruptionScenario;
  onDisrupt?: () => void;
}

export function DisruptionSimulator({ scenario, onDisrupt }: DisruptionSimulatorProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typedText, setTypedText] = useState("");
  const [visibleImpacts, setVisibleImpacts] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const startSimulation = useCallback(() => {
    setPhase("detecting");
    onDisrupt?.();
  }, [onDisrupt]);

  // Phase: detecting → type out the cause text
  useEffect(() => {
    if (phase !== "detecting") return;
    const text = scenario.cause;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("impact"), 800);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [phase, scenario.cause]);

  // Phase: impact → stagger in each impact line
  useEffect(() => {
    if (phase !== "impact") return;
    const total = scenario.cascadingImpacts.length;
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleImpacts(count);
      if (count >= total) {
        clearInterval(interval);
        setTimeout(() => setPhase("options"), 600);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [phase, scenario.cascadingImpacts.length]);

  // IDLE
  if (phase === "idle") {
    return (
      <Card className="p-6 border-[#A0784A]/15 bg-[#A0784A]/[0.02]">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#A0784A]/10 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#A0784A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-[#A0784A] mb-1">
              Real-Time Disruption Engine
            </h3>
            <p className="text-xs text-white/40 mb-4 leading-relaxed">
              Test how Ensemble handles live disruptions. This simulation triggers a 3-hour flight
              delay and shows cascading impact analysis, resolution options, and a pre-packaged
              Lifestyle Strategist briefing.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={startSimulation}
              className="border-[#A0784A]/20 text-[#A0784A] hover:bg-[#A0784A]/10"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Simulate Disruption
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-[#C75050]/20 bg-[#C75050]/[0.02]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-[#C75050]/15 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-[#C75050]" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-[#C75050]">
            Flight Disruption Detected
          </h3>
          <p className="text-[11px] text-white/40">{scenario.triggerLabel}</p>
        </div>
      </div>

      {/* Detecting phase: typewriter */}
      {(phase === "detecting" || phase === "impact" || phase === "options" || phase === "briefing") && (
        <div className="mb-5 p-3 rounded-lg bg-[#0A0A0A] border border-white/[0.06]">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#C75050]/60 mb-1.5">
            Cause
          </p>
          <p className="text-sm text-white/60 font-mono leading-relaxed">
            {typedText}
            {phase === "detecting" && <span className="animate-pulse text-[#C75050]">|</span>}
          </p>
        </div>
      )}

      {/* Impact analysis */}
      {(phase === "impact" || phase === "options" || phase === "briefing") && (
        <div className="mb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/30 mb-3">
            Cascading Impact Analysis
          </p>
          <div className="space-y-2">
            {scenario.cascadingImpacts.slice(0, visibleImpacts).map((impact, i) => {
              const dotColor =
                impact.severity === "red" ? "bg-[#C75050]" :
                impact.severity === "amber" ? "bg-[#A0784A]" :
                impact.severity === "green" ? "bg-[#4CAF7C]" :
                "bg-blue-400";
              return (
                <div key={i} className="flex items-start gap-2.5 animate-fade-in-up text-xs">
                  <span className={`w-2 h-2 rounded-full ${dotColor} mt-1 shrink-0`} />
                  <span className="text-white/50">{impact.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resolution options */}
      {(phase === "options" || phase === "briefing") && (
        <div className="mb-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/30 mb-3">
            Resolution Options
          </p>
          <div className="space-y-3">
            {scenario.resolutionOptions.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedOption(opt.id);
                    if (phase === "options") {
                      setTimeout(() => setPhase("briefing"), 300);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-[#4CAF7C]/30 bg-[#4CAF7C]/[0.05] ring-1 ring-[#4CAF7C]/20"
                      : "border-white/[0.06] bg-[#141414] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#4CAF7C]" />}
                      <h4 className="text-sm font-medium text-[#F5F5F5]">{opt.title}</h4>
                    </div>
                    <ConfidenceBadge score={opt.confidence} size="sm" />
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed mb-2">
                    {opt.description}
                  </p>
                  <p className="text-[11px] text-[#A0784A]/70">
                    Tradeoff: {opt.tradeoff}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Strategist briefing */}
      {phase === "briefing" && selectedOption && (
        <div className="animate-fade-in">
          <div className="p-5 rounded-xl bg-[#A0784A]/[0.05] border border-[#A0784A]/20">
            <div className="flex items-center gap-2 mb-3">
              <PhoneCall className="w-4 h-4 text-[#A0784A]" />
              <h4 className="text-xs font-medium uppercase tracking-[0.08em] text-[#A0784A]">
                Lifestyle Strategist Briefing
              </h4>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              {scenario.strategistBriefing}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
