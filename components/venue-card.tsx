"use client";

import { Venue, RankedVenue, Compromise } from "@/lib/types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ConfidenceBadge } from "./confidence-badge";
import {
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

interface VenueCardProps {
  venue: Venue;
  ranking?: RankedVenue;
  children?: React.ReactNode;
}

export function VenueCard({ venue, ranking, children }: VenueCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="p-4 sm:p-6 transition-all duration-200 hover:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            {ranking && (
              <span className="text-xs font-mono font-medium text-white/30 w-6">
                #{ranking.rank}
              </span>
            )}
            <div>
              <h3 className="text-base font-medium text-[#F5F5F5]">
                {venue.name}
              </h3>
              {venue.subtitle && (
                <p className="text-[11px] text-white/35">{venue.subtitle}</p>
              )}
            </div>
            {venue.auroraEdge && (
              <Badge variant="gold" className="text-[10px] gap-1">
                <Sparkles className="w-3 h-3" />
                EDGE
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/40 mt-1">
            <span>{venue.cuisine}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {venue.neighborhood}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{venue.priceRange}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Up to {venue.capacity}
            </span>
          </div>

          {/* Dietary accommodations */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {venue.dietaryAccommodations.map((d) => (
              <Badge key={d} variant="default" className="text-[10px]">
                {d}
              </Badge>
            ))}
          </div>

          {/* Price tier warning */}
          {venue.priceRange === "$$$" && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-[#A0784A]/70">
              <AlertTriangle className="w-3 h-3" />
              Below group&apos;s minimum price tier
            </div>
          )}

          {/* Aurora perks */}
          {venue.auroraEdge && venue.auroraPerks && (
            <div className="mt-3 text-xs text-[#A0784A]/70">
              {venue.auroraPerks}
            </div>
          )}
        </div>

        {ranking && (
          <div className="shrink-0">
            <ConfidenceBadge score={ranking.confidenceScore} />
          </div>
        )}
      </div>

      {/* Expandable reasoning */}
      {ranking && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 mt-4 text-xs text-white/40 hover:text-white/60 transition-colors cursor-pointer"
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {expanded ? "Hide details" : "View reasoning & compromises"}
          </button>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-3">
              <p className="text-sm text-white/60 leading-relaxed">
                {ranking.reasoning}
              </p>

              {ranking.compromises.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/30">
                    Compromises
                  </h4>
                  {ranking.compromises.map((c: Compromise, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-white/50 font-medium shrink-0">
                        {c.participantName || c.participantId}:
                      </span>
                      <span className="text-white/40">{c.compromise}</span>
                    </div>
                  ))}
                </div>
              )}

              {ranking.unresolvable.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#C75050]/70">
                    Unresolvable
                  </h4>
                  {ranking.unresolvable.map((u, i) => (
                    <p key={i} className="text-xs text-[#C75050]/60">
                      {u}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {children && <div className="mt-4 pt-4 border-t border-white/[0.06]">{children}</div>}
    </Card>
  );
}
