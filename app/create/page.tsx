"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { StepIndicator } from "@/components/step-indicator";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const eventTypes = [
  { value: "dinner", label: "Dinner" },
  { value: "travel", label: "Travel" },
  { value: "experience", label: "Experience" },
  { value: "wellness", label: "Wellness" },
];

const typeConfig: Record<string, { locationLabel: string; locationPlaceholder: string; dateLabel: string; timeLabel: string; timePlaceholder: string; vibeLabel: string; vibePlaceholder: string }> = {
  dinner: {
    locationLabel: "Location",
    locationPlaceholder: "City or neighborhood",
    dateLabel: "Date",
    timeLabel: "Time Window",
    timePlaceholder: "e.g. 19:00 - 23:00",
    vibeLabel: "Vibe",
    vibePlaceholder: "What's the occasion? What energy are you going for?",
  },
  travel: {
    locationLabel: "Destination",
    locationPlaceholder: "e.g. Turks & Caicos, Aspen, Amalfi Coast",
    dateLabel: "Check-in Date",
    timeLabel: "Duration",
    timePlaceholder: "e.g. May 15-19 (4 nights)",
    vibeLabel: "Trip Purpose",
    vibePlaceholder: "What's the trip for? Celebration, team retreat, family vacation?",
  },
  experience: {
    locationLabel: "Location",
    locationPlaceholder: "City or venue",
    dateLabel: "Date",
    timeLabel: "Time Window",
    timePlaceholder: "e.g. 14:00 - 18:00",
    vibeLabel: "Vibe",
    vibePlaceholder: "What kind of experience? Art, music, adventure, private event?",
  },
  wellness: {
    locationLabel: "Location",
    locationPlaceholder: "City, resort, or retreat center",
    dateLabel: "Start Date",
    timeLabel: "Duration",
    timePlaceholder: "e.g. 3 days, weekend, week-long",
    vibeLabel: "Focus",
    vibePlaceholder: "What's the goal? Recovery, detox, fitness, mindfulness?",
  },
};

export default function CreatePage() {
  const { event, setEvent, setCurrentStep, loadScenario } = useApp();
  const config = typeConfig[event.type] || typeConfig.dinner;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <StepIndicator
        currentStep={0}
        steps={["Create", "Participants", "Reconcile", "Proposal"]}
      />

      <div>
        <h1 className="text-2xl font-light tracking-[0.02em] text-[#F5F5F5] mb-2">
          Create Experience
        </h1>
        <p className="text-sm text-white/40">
          Define the basics. Ensemble will handle the complexity.
        </p>
      </div>

      <Card className="p-5 sm:p-8 max-w-2xl">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Select
              label="Event Type"
              id="event-type"
              options={eventTypes}
              value={event.type}
              onChange={(e) => {
                loadScenario(e.target.value as EventType);
              }}
            />
            <Input
              label={config.locationLabel}
              id="location"
              value={event.location}
              onChange={(e) =>
                setEvent({ ...event, location: e.target.value })
              }
              placeholder={config.locationPlaceholder}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label={config.dateLabel}
              id="date"
              type="date"
              value={event.date}
              onChange={(e) =>
                setEvent({ ...event, date: e.target.value })
              }
            />
            <Input
              label={config.timeLabel}
              id="time"
              value={event.timeWindow}
              onChange={(e) =>
                setEvent({ ...event, timeWindow: e.target.value })
              }
              placeholder={config.timePlaceholder}
            />
          </div>

          <Textarea
            label={config.vibeLabel}
            id="vibe"
            value={event.vibe}
            onChange={(e) => setEvent({ ...event, vibe: e.target.value })}
            placeholder={config.vibePlaceholder}
            rows={3}
          />
        </div>

        <div className="mt-8 flex justify-end">
          <Link href="/participants" onClick={() => setCurrentStep(2)}>
            <Button type="button">
              Add Participants
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

type EventType = "dinner" | "travel" | "experience" | "wellness";
