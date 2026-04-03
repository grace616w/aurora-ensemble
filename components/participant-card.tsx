"use client";

import { MemberProfile } from "@/lib/types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FlightInfo } from "@/lib/types";
import {
  Heart,
  Moon,
  Zap,
  MapPin,
  Clock,
  UserPlus,
  X,
  Plane,
  Accessibility,
} from "lucide-react";
import { useState } from "react";

interface ParticipantCardProps {
  member: MemberProfile;
  onRemove?: () => void;
  onSendIntake?: () => void;
  compact?: boolean;
  mode?: "dinner" | "travel";
  flight?: FlightInfo;
}

export function ParticipantCard({
  member,
  onRemove,
  onSendIntake,
  compact = false,
  mode = "dinner",
  flight,
}: ParticipantCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { preferences } = member;
  const hs = preferences.healthSignals;

  return (
    <Card className="p-5 relative group">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/60 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
            member.isAuroraMember
              ? "bg-[#A0784A]/15 text-[#A0784A] border-2 border-[#A0784A]/50"
              : "bg-white/5 text-white/50 border-2 border-white/15"
          }`}
        >
          {member.avatarInitials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-medium text-[#F5F5F5] truncate">
              {member.name}
            </h3>
            {member.isAuroraMember ? (
              <Badge variant="gold" className="text-[10px] px-2 py-0.5">
                MEMBER
              </Badge>
            ) : (
              <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full border border-dashed border-white/20 text-white/40">
                GUEST
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 truncate">{member.role}</p>

          {!compact && (
            <>
              {/* Quick tags — context-aware */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {mode === "travel" && flight && (
                  <>
                    <Badge variant={flight.flightType === "private" ? "gold" : "default"} className="text-[10px] gap-1">
                      <Plane className="w-3 h-3" />
                      {flight.flightType === "private" ? "Private" : flight.departureAirport}
                    </Badge>
                    <Badge variant="default" className="text-[10px]">
                      {flight.departureCity.split(",")[0]}
                    </Badge>
                  </>
                )}
                {mode === "travel" && preferences.accessibility.length > 0 && (
                  <Badge variant="warning" className="text-[10px] gap-1">
                    <Accessibility className="w-3 h-3" />
                    {preferences.accessibility[0]}
                  </Badge>
                )}
                {preferences.dietary.length > 0 ? (
                  preferences.dietary.map((d) => (
                    <Badge key={d} variant="default" className="text-[10px]">
                      {d}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="success" className="text-[10px]">
                    no dietary restrictions
                  </Badge>
                )}
                {mode === "dinner" && preferences.cuisineAffinities.length > 0 && (
                  <Badge variant="default" className="text-[10px]">
                    {preferences.cuisineAffinities.slice(0, 2).join(", ")}
                  </Badge>
                )}
                <Badge variant="default" className="text-[10px]">
                  {mode === "travel" ? preferences.ambiancePreference + " lodging" : preferences.ambiancePreference}
                </Badge>
              </div>

              {/* Health signals for Aurora members */}
              {hs && (
                <div className="flex items-center gap-4 mt-3 text-[11px] text-white/40">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Recovery {hs.recoveryScore}
                  </span>
                  <span className="flex items-center gap-1">
                    <Moon className="w-3 h-3" />
                    Sleep {hs.sleepScore}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Stress {hs.stressLevel}
                  </span>
                </div>
              )}

              {/* Expandable details */}
              {member.isAuroraMember && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="mt-3 text-[11px] text-[#A0784A]/70 hover:text-[#A0784A] transition-colors cursor-pointer"
                >
                  {expanded ? "Show less" : "View full profile"}
                </button>
              )}

              {expanded && (
                <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2.5 text-xs text-white/50">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>
                      Prefers: {preferences.neighborhoodPreferences.join(", ")}
                    </span>
                  </div>
                  {preferences.neighborhoodAvoidances.length > 0 && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-[#C75050]" />
                      <span>
                        Avoids: {preferences.neighborhoodAvoidances.join(", ")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <Clock className="w-3 h-3 mt-0.5 shrink-0" />
                    <span>{preferences.schedule.available.join(", ")}</span>
                  </div>
                  {preferences.cuisineAversions.length > 0 && (
                    <div className="text-[#C75050]/70">
                      Cuisine aversions: {preferences.cuisineAversions.join(", ")}
                    </div>
                  )}
                </div>
              )}

              {/* Guest: sparse profile with intake CTA */}
              {!member.isAuroraMember && onSendIntake && (
                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <p className="text-[11px] text-white/30 mb-2">
                    Limited profile — not an Aurora member
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onSendIntake}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Send Preference Intake
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
