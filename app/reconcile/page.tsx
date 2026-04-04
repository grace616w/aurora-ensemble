"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { StepIndicator } from "@/components/step-indicator";
import { VenueCard } from "@/components/venue-card";
import { HandoffBanner } from "@/components/handoff-banner";
import { ReconciliationSkeleton } from "@/components/shimmer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Shield, Clock, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ReconciliationResult } from "@/lib/types";
import { FlightTimeline } from "@/components/flight-timeline";
import { DisruptionSimulator } from "@/components/disruption-simulator";
import { travelFlights, disruptionScenario } from "@/lib/mock-data";

export default function ReconcilePage() {
  const {
    event,
    participants,
    activeVenues,
    reconciliationResult,
    setReconciliationResult,
    setCurrentStep,
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [localResult, setLocalResult] = useState<ReconciliationResult | null>(null);
  const hasFetchedRef = useRef(false);

  const result = reconciliationResult || localResult;

  useEffect(() => {
    if (result || hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    setLoading(true);

    fetch("/api/reconcile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, participants, venues: activeVenues }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLocalResult(data);
        setReconciliationResult(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Reconciliation error:", err);
        setLoading(false);
      });
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  const isTravel = event.type === "travel";
  const [flightDisrupted, setFlightDisrupted] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <StepIndicator
        currentStep={2}
        steps={["Create", "Participants", "Reconcile", "Proposal"]}
      />

      <div>
        <h1 className="text-2xl font-light tracking-[0.02em] text-[#F5F5F5] mb-2">
          Reconciliation
        </h1>
        <p className="text-sm text-white/40">
          Analyzing {participants.length} preference profiles across{" "}
          {activeVenues.length} venues
        </p>
      </div>

      {loading && !result && <ReconciliationSkeleton />}

      {result && (
        <div className="space-y-8 animate-fade-in">
          {/* Group Analysis */}
          <Card className="p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-white/30 mb-5">
              Group Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Shield className="w-4 h-4 text-[#C75050]" />
                  Hard Constraints
                </div>
                <div className="space-y-1.5">
                  {result.groupAnalysis.hardConstraints.map((c, i) => (
                    <p key={i} className="text-xs text-white/40 pl-6">{c}</p>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <AlertTriangle className="w-4 h-4 text-[#A0784A]" />
                  Soft Constraints
                </div>
                <div className="space-y-1.5">
                  {result.groupAnalysis.softConstraints.map((c, i) => (
                    <p key={i} className="text-xs text-white/40 pl-6">{c}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-white/30 mb-0.5">Schedule Overlap</p>
                  <p className="text-sm text-white/60">{result.groupAnalysis.scheduleOverlap}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-[#A0784A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-white/30 mb-0.5">Primary Tension</p>
                  <p className="text-sm text-white/60">{result.groupAnalysis.primaryTension}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Flight Coordination (travel only) */}
          {isTravel && (
            <FlightTimeline
              flights={travelFlights}
              disrupted={flightDisrupted}
              disruptedParticipants={disruptionScenario.affectedParticipants}
            />
          )}

          {/* Ranked Venues */}
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-white/30 mb-5">
              {isTravel ? "Ranked Lodging" : "Ranked Recommendations"}
            </h2>
            <div className="space-y-4">
              {result.rankedVenues.map((rv) => {
                const venue = activeVenues.find((v) => v.id === rv.venueId);
                if (!venue) return null;
                return (
                  <div key={rv.venueId} className="animate-fade-in-up">
                    <VenueCard venue={venue} ranking={rv}>
                      {venue.auroraEdge && (
                        <Badge variant="gold" className="text-[10px]">
                          Aurora Edge Partner
                        </Badge>
                      )}
                    </VenueCard>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disruption Simulator (travel only) */}
          {isTravel && (
            <DisruptionSimulator
              scenario={disruptionScenario}
              onDisrupt={() => setFlightDisrupted(true)}
            />
          )}

          {/* Escalation Banner */}
          {result.escalationRequired && result.escalationReason && (
            <HandoffBanner
              reason={result.escalationReason}
              context={result.escalationContext}
            />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <Link href="/participants" onClick={() => setCurrentStep(2)}>
          <Button variant="ghost" type="button">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        {result && (
          <Link href="/proposal" onClick={() => setCurrentStep(4)}>
            <Button type="button">
              View Group Proposal
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
