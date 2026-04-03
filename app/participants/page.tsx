"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { StepIndicator } from "@/components/step-indicator";
import { ParticipantCard } from "@/components/participant-card";
import { PreferenceGraph } from "@/components/preference-graph";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Plane, MapPin, Accessibility } from "lucide-react";
import { useState } from "react";
import { travelFlights } from "@/lib/mock-data";

export default function ParticipantsPage() {
  const { event, participants, removeParticipant, setCurrentStep } = useApp();
  const isTravel = event.type === "travel";
  const [toastVisible, setToastVisible] = useState(false);

  const handleSendIntake = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <StepIndicator
        currentStep={1}
        steps={["Create", "Participants", "Reconcile", "Proposal"]}
      />

      <div>
        <h1 className="text-2xl font-light tracking-[0.02em] text-[#F5F5F5] mb-2">
          Participants
        </h1>
        <p className="text-sm text-white/40">
          {participants.length} participant{participants.length !== 1 && "s"} — review preferences and compatibility
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Participant list */}
        <div className="lg:col-span-2 space-y-4">
          {participants.map((member) => (
            <div key={member.id} className="animate-fade-in-up">
              <ParticipantCard
                member={member}
                mode={isTravel ? "travel" : "dinner"}
                flight={isTravel ? travelFlights.find(f => f.participantId === member.id) : undefined}
                onRemove={
                  participants.length > 2
                    ? () => removeParticipant(member.id)
                    : undefined
                }
                onSendIntake={
                  !member.isAuroraMember ? handleSendIntake : undefined
                }
              />
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-6">
            <PreferenceGraph participants={participants} />
          </Card>

          <Card className="p-5">
            <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-white/30 mb-3">
              {isTravel ? "Logistics Overview" : "Quick Summary"}
            </h3>
            <div className="space-y-2 text-xs text-white/40">
              <p>
                <span className="text-white/60 font-medium">
                  {participants.filter((p) => p.isAuroraMember).length}
                </span>{" "}
                Aurora members with full profiles
              </p>
              <p>
                <span className="text-white/60 font-medium">
                  {participants.filter((p) => !p.isAuroraMember).length}
                </span>{" "}
                guest{participants.filter((p) => !p.isAuroraMember).length !== 1 && "s"} with limited data
              </p>

              {isTravel ? (
                <>
                  <div className="pt-2 mt-2 border-t border-white/[0.06] space-y-2">
                    <p className="flex items-center gap-1.5">
                      <Plane className="w-3 h-3 shrink-0" />
                      <span className="text-white/60 font-medium">
                        {new Set(travelFlights.map(f => f.departureAirport)).size}
                      </span>{" "}
                      departure airports
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      Staggered arrivals across 2 days
                    </p>
                    {participants.some(p => p.preferences.accessibility.length > 0) && (
                      <p className="flex items-center gap-1.5 text-[#A0784A]">
                        <Accessibility className="w-3 h-3 shrink-0" />
                        Accessibility requirements flagged
                      </p>
                    )}
                  </div>
                  <p className="pt-2 mt-2 border-t border-white/[0.06]">
                    <span className="text-white/60 font-medium">
                      {new Set(participants.flatMap(p => p.preferences.dietary)).size}
                    </span>{" "}
                    dietary requirements carry over to on-trip dining
                  </p>
                </>
              ) : (
                <p>
                  <span className="text-white/60 font-medium">
                    {new Set(participants.flatMap((p) => p.preferences.dietary)).size}
                  </span>{" "}
                  unique dietary requirements
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Link href="/create" onClick={() => setCurrentStep(1)}>
          <Button variant="ghost" type="button">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <Link href="/reconcile" onClick={() => setCurrentStep(3)}>
          <Button type="button">
            Run Reconciliation
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-8 right-8 bg-[#1A1A1A] border border-white/[0.06] rounded-xl px-5 py-3 text-sm text-white/60 z-50 animate-fade-in-up">
          Preference intake link sent to james@theorem.com
        </div>
      )}
    </div>
  );
}
