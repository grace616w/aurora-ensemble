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

export default function CreatePage() {
  const { event, setEvent, setCurrentStep } = useApp();

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
              onChange={(e) =>
                setEvent({
                  ...event,
                  type: e.target.value as EventType,
                })
              }
            />
            <Input
              label="Location"
              id="location"
              value={event.location}
              onChange={(e) =>
                setEvent({ ...event, location: e.target.value })
              }
              placeholder="City or region"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Date"
              id="date"
              type="date"
              value={event.date}
              onChange={(e) =>
                setEvent({ ...event, date: e.target.value })
              }
            />
            <Input
              label="Time Window"
              id="time"
              value={event.timeWindow}
              onChange={(e) =>
                setEvent({ ...event, timeWindow: e.target.value })
              }
              placeholder="e.g. 19:00 - 23:00"
            />
          </div>

          <Input
            label="Group Size"
            id="group-size"
            type="number"
            value={event.groupSize}
            onChange={(e) =>
              setEvent({ ...event, groupSize: parseInt(e.target.value) || 0 })
            }
            min={2}
            max={20}
          />

          <Textarea
            label="Vibe"
            id="vibe"
            value={event.vibe}
            onChange={(e) => setEvent({ ...event, vibe: e.target.value })}
            placeholder="What's the occasion? What energy are you going for?"
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
