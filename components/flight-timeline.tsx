"use client";

import { FlightInfo } from "@/lib/types";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Plane, Car } from "lucide-react";

interface FlightTimelineProps {
  flights: FlightInfo[];
  disrupted?: boolean;
  disruptedParticipants?: string[];
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const airportColors: Record<string, string> = {
  TEB: "bg-[#A0784A]/20 text-[#A0784A] border-[#A0784A]/30",
  JFK: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  LAX: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

export function FlightTimeline({ flights, disrupted, disruptedParticipants = [] }: FlightTimelineProps) {
  const day1 = flights.filter((f) => f.departureTime.startsWith("2026-05-15"));
  const day2 = flights.filter((f) => f.departureTime.startsWith("2026-05-16"));

  // Group by transfer group
  const transferGroups = new Map<number, FlightInfo[]>();
  for (const f of flights) {
    const group = transferGroups.get(f.transferGroup) || [];
    group.push(f);
    transferGroups.set(f.transferGroup, group);
  }

  function FlightRow({ flight }: { flight: FlightInfo }) {
    const isDisrupted = disrupted && disruptedParticipants.includes(flight.participantId);
    const colorClass = airportColors[flight.departureAirport] || "bg-white/10 text-white/50";

    return (
      <div
        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all ${
          isDisrupted ? "animate-pulse-red bg-[#C75050]/5" : "hover:bg-white/[0.02]"
        }`}
      >
        {/* Airport badge */}
        <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border shrink-0 ${colorClass}`}>
          {flight.departureAirport}
        </span>

        {/* Name + flight info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#F5F5F5] font-medium truncate">
              {flight.participantName}
            </span>
            {flight.flightType === "private" && (
              <Badge variant="gold" className="text-[9px] px-1.5 py-0">
                PRIVATE
              </Badge>
            )}
            {isDisrupted && (
              <Badge variant="error" className="text-[9px] px-1.5 py-0">
                DELAYED
              </Badge>
            )}
          </div>
          <span className="text-[11px] text-white/30">
            {flight.flightNumber || "Charter"} · {flight.departureCity}
          </span>
        </div>

        {/* Flight bar */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/40">
          <span>{formatTime(flight.departureTime)}</span>
          <div className="w-16 h-px bg-white/10 relative">
            <Plane className="w-3 h-3 absolute -top-1.5 right-0 text-white/20" />
          </div>
          <span className={`font-mono ${isDisrupted ? "text-[#C75050] line-through" : "text-white/60"}`}>
            {formatTime(flight.arrivalTime)}
          </span>
        </div>

        {/* Transfer group */}
        <div className="flex items-center gap-1 shrink-0">
          <Car className="w-3 h-3 text-white/20" />
          <span className="text-[10px] text-white/30 font-mono">T{flight.transferGroup}</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">
          Flight Coordination
        </h2>
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#A0784A]/40" /> TEB
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500/40" /> JFK
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500/40" /> LAX
          </span>
        </div>
      </div>

      {/* Day 1 */}
      {day1.length > 0 && (
        <div className="mb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/20 mb-2">
            {formatDate(day1[0].departureTime)} — Advance arrivals
          </p>
          <div className="space-y-1">
            {day1.map((f) => <FlightRow key={f.participantId} flight={f} />)}
          </div>
        </div>
      )}

      {/* Day 2 */}
      {day2.length > 0 && (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/20 mb-2">
            {formatDate(day2[0].departureTime)} — Main group
          </p>
          <div className="space-y-1">
            {day2.map((f) => <FlightRow key={f.participantId} flight={f} />)}
          </div>
        </div>
      )}

      {/* Transfer summary */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/20 mb-2">
          Ground Transfers
        </p>
        <div className="space-y-1.5">
          {[...transferGroups.entries()].map(([group, members]) => (
            <div key={group} className="flex items-center gap-2 text-xs text-white/40">
              <Car className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono text-white/30">T{group}</span>
              <span>{members.map((m) => m.participantName.split(" ")[0]).join(", ")}</span>
              <span className="text-white/20">· {formatTime(members[0].arrivalTime)}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
