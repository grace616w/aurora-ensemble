"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  Users,
  Brain,
  MessageSquare,
  ArrowRight,
  Utensils,
  Plane,
  Sparkles,
  Heart,
} from "lucide-react";
import { useApp } from "@/lib/context";

const steps = [
  {
    icon: Utensils,
    title: "Define Experience",
    description: "Set the event type, date, location, and vibe",
  },
  {
    icon: Users,
    title: "Add Participants",
    description: "Import member profiles and invite guests",
  },
  {
    icon: Brain,
    title: "AI Reconciliation",
    description: "Constraint analysis across all preferences",
  },
  {
    icon: MessageSquare,
    title: "Group Proposal",
    description: "Ranked options with voting for the group",
  },
];

const features = [
  {
    icon: Heart,
    label: "Health-aware",
    description: "Factors in wearable data for timing and energy",
  },
  {
    icon: Sparkles,
    label: "Aurora Edge",
    description: "Priority access at partner venues",
  },
  {
    icon: Plane,
    label: "Multi-format",
    description: "Dinners, travel, wellness, experiences",
  },
];

export default function DashboardPage() {
  const { setCurrentStep } = useApp();

  return (
    <div className="space-y-16">
      {/* Hero */}
      <div className="text-center pt-8 animate-fade-in-up">
        <div
          className="inline-block rounded-2xl px-6 py-6 sm:px-10 sm:py-8 mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(160,120,74,0.1), rgba(160,120,74,0.04), rgba(160,120,74,0.02))",
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-light tracking-[0.02em] text-[#F5F5F5] mb-3">
            Group Experience Coordination
          </h1>
          <p className="text-base text-white/50 max-w-lg mx-auto leading-relaxed">
            Your members don&apos;t dine alone. Ensemble reconciles group preferences,
            surfaces conflicts, and recommends — so your Lifestyle Strategists
            spend time on judgment, not logistics.
          </p>
        </div>
        <div>
          <Link href="/create" onClick={() => setCurrentStep(1)}>
            <Button size="lg" type="button">
              Start New Experience
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div className="animate-fade-in animate-delay-100">
        <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-white/30 mb-6">
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <Card key={step.title} className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <step.icon className="w-4 h-4 text-white/40" />
                </div>
                <span className="text-xs font-mono text-white/30">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-sm font-medium text-[#F5F5F5] mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="animate-fade-in animate-delay-200">
        <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-white/30 mb-6">
          Built for Aurora
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card key={f.label} className="p-5">
              <f.icon className="w-4 h-4 text-[#A0784A]/60 mb-3" />
              <h3 className="text-sm font-medium text-[#F5F5F5] mb-1">
                {f.label}
              </h3>
              <p className="text-xs text-white/40 leading-relaxed">
                {f.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Demo scenario */}
      <div className="animate-fade-in animate-delay-300">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-white/30 mb-2">
                Demo Scenario
              </h2>
              <h3 className="text-base font-medium text-[#F5F5F5] mb-2">
                Series B Celebration Dinner — NYC, April 11
              </h3>
              <p className="text-sm text-white/40 max-w-2xl leading-relaxed">
                4 guests. A vegan, a pescatarian, a steakhouse loyalist, and an
                external guest with a sparse profile. 2.5-hour schedule window.
                Ensemble finds the venue, explains the tradeoffs, and flags what
                needs a human touch — in seconds.
              </p>
            </div>
            <Link href="/create" onClick={() => setCurrentStep(1)}>
              <Button variant="secondary" type="button" className="shrink-0">
                Try it
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
