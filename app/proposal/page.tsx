"use client";

import Link from "next/link";
import { useApp } from "@/lib/context";
import { StepIndicator } from "@/components/step-indicator";
import { VenueCard } from "@/components/venue-card";
import { CompactVote } from "@/components/vote-indicator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Calendar, MapPin, Users, Sparkles } from "lucide-react";
// venues come from context.activeVenues
import { useState, useEffect } from "react";

export default function ProposalPage() {
  const {
    event,
    participants,
    activeVenues: venues,
    reconciliationResult,
    votes,
    setVote,
    setCurrentStep,
  } = useApp();
  const [confirmed, setConfirmed] = useState(false);

  const result = reconciliationResult;
  const topVenues = result?.rankedVenues.slice(0, 3) || [];

  // Pre-load votes: Sarah and Anika upvote Shukette (venue-3) on mount
  useEffect(() => {
    if (!result) return;
    const topVenueId = result.rankedVenues[0]?.venueId;
    if (!topVenueId) return;
    if (!votes["sarah-chen"]?.[topVenueId]) {
      setVote("sarah-chen", topVenueId, "up");
    }
    if (!votes["anika-patel"]?.[topVenueId]) {
      setVote("anika-patel", topVenueId, "up");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  // handleBack not needed - using Link

  function getVoteCounts(venueId: string) {
    let up = 0;
    let down = 0;
    for (const pid of Object.keys(votes)) {
      const v = votes[pid]?.[venueId];
      if (v === "up") up++;
      if (v === "down") down++;
    }
    return { up, down };
  }

  function getWinner() {
    let best = "";
    let bestCount = 0;
    for (const rv of topVenues) {
      const { up } = getVoteCounts(rv.venueId);
      if (up > bestCount) {
        bestCount = up;
        best = rv.venueId;
      }
    }
    return best;
  }

  function cycleVote(participantId: string, venueId: string) {
    const current = votes[participantId]?.[venueId] || null;
    const next = current === null ? "up" : current === "up" ? "down" : null;
    setVote(participantId, venueId, next);
  }

  if (!result) {
    return (
      <div className="space-y-8">
        <StepIndicator
          currentStep={3}
          steps={["Create", "Participants", "Reconcile", "Proposal"]}
        />
        <Card className="p-8 text-center">
          <p className="text-sm text-white/40">
            No reconciliation results yet. Please complete the reconciliation
            step first.
          </p>
          <Link href="/reconcile" onClick={() => setCurrentStep(3)}>
            <Button variant="secondary" type="button" className="mt-4">
              Go to Reconciliation
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const winner = getWinner();
  const winnerVenue = venues.find((v) => v.id === winner);
  const winnerCounts = winner ? getVoteCounts(winner) : { up: 0, down: 0 };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <StepIndicator
        currentStep={3}
        steps={["Create", "Participants", "Reconcile", "Proposal"]}
      />

      <div>
        <h1 className="text-2xl font-light tracking-[0.02em] text-[#F5F5F5] mb-2">
          {event.type === "travel" ? "Lodging Proposal"
            : event.type === "experience" ? "Experience Proposal"
            : event.type === "wellness" ? "Wellness Proposal"
            : "Group Proposal"}
        </h1>
        <p className="text-sm text-white/40">
          {event.type === "travel"
            ? "Top recommendations — tap avatars to vote on lodging"
            : event.type === "experience"
            ? "Top recommendations — tap avatars to vote on experiences"
            : event.type === "wellness"
            ? "Top recommendations — tap avatars to vote on retreats"
            : "Top 3 recommendations — tap avatars to vote"}
        </p>
      </div>

      {/* Event summary */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-white/50">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A0784A]" />
            {event.vibe}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {participants.length} guests
          </span>
        </div>
      </Card>

      {/* Venue options with compact voting */}
      <div className="space-y-4">
        {topVenues.map((rv) => {
          const venue = venues.find((v) => v.id === rv.venueId);
          if (!venue) return null;
          const voteCounts = getVoteCounts(rv.venueId);
          const isWinner = rv.venueId === winner && !confirmed;

          return (
            <div
              key={rv.venueId}
              className={`animate-fade-in-up ${
                isWinner ? "ring-1 ring-[#4CAF7C]/30 rounded-xl" : ""
              }`}
            >
              <VenueCard venue={venue} ranking={rv}>
                <div className="flex items-center justify-between">
                  {/* Compact vote circles */}
                  <div className="flex items-center gap-2">
                    {participants.map((p) => (
                      <CompactVote
                        key={p.id}
                        initials={p.avatarInitials}
                        isMember={p.isAuroraMember}
                        vote={votes[p.id]?.[rv.venueId] || null}
                        onToggle={() => cycleVote(p.id, rv.venueId)}
                      />
                    ))}
                  </div>

                  {/* Tally */}
                  <div className="flex items-center gap-3 text-xs">
                    {voteCounts.up > 0 && (
                      <span className="font-mono text-[#4CAF7C]">
                        {voteCounts.up} yes
                      </span>
                    )}
                    {voteCounts.down > 0 && (
                      <span className="font-mono text-[#C75050]">
                        {voteCounts.down} no
                      </span>
                    )}
                    {voteCounts.up === 0 && voteCounts.down === 0 && (
                      <span className="font-mono text-white/20">
                        no votes yet
                      </span>
                    )}
                  </div>
                </div>
              </VenueCard>
            </div>
          );
        })}
      </div>

      {/* Confirmed state */}
      {confirmed && (
        <div className="animate-fade-in">
          <Card className="p-6 border-[#4CAF7C]/20 bg-[#4CAF7C]/[0.03]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#4CAF7C]/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-[#4CAF7C]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#4CAF7C]">
                  Booking Request Sent
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  {event.type === "travel"
                    ? `Your Lifestyle Strategist will coordinate booking at ${winnerVenue?.name}, arrange flights and transfers, and send the complete itinerary to all ${participants.length} travelers.`
                    : event.type === "experience"
                    ? `Your Lifestyle Strategist will arrange the private experience at ${winnerVenue?.name} and send confirmations to all ${participants.length} participants.`
                    : event.type === "wellness"
                    ? `Your Lifestyle Strategist will book the retreat at ${winnerVenue?.name} and coordinate dietary and accessibility needs for all ${participants.length} participants.`
                    : `Your Lifestyle Strategist will finalize the reservation at ${winnerVenue?.name} and send confirmations to all participants.`}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom bar: Back + Confirm & Book */}
      <div className="flex items-center justify-between pt-4">
        <Link href="/reconcile" onClick={() => setCurrentStep(3)}>
          <Button variant="ghost" type="button">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>

        {winner && !confirmed && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-white/40">Leading choice</p>
              <p className="text-sm text-[#F5F5F5] font-medium">
                {winnerVenue?.name}{" "}
                <span className="text-xs font-mono text-[#4CAF7C]">
                  {winnerCounts.up} yes
                </span>
              </p>
            </div>
            <Button onClick={() => setConfirmed(true)}>
              Confirm & Book
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
