"use client";

import { MemberProfile } from "@/lib/types";
import { useMemo } from "react";

interface PreferenceGraphProps {
  participants: MemberProfile[];
}

function computeOverlap(participants: MemberProfile[]): {
  dietary: number;
  cuisine: number;
  ambiance: number;
  schedule: number;
  overall: number;
} {
  if (participants.length < 2)
    return { dietary: 100, cuisine: 100, ambiance: 100, schedule: 100, overall: 100 };

  const allDietary = participants.flatMap((p) => p.preferences.dietary);
  const uniqueDietary = new Set(allDietary);
  const dietaryScore = Math.max(20, 100 - uniqueDietary.size * 15);

  const cuisineSets = participants
    .map((p) => new Set(p.preferences.cuisineAffinities))
    .filter((s) => s.size > 0);
  let cuisineScore = 50;
  if (cuisineSets.length >= 2) {
    const allCuisines = new Set(cuisineSets.flatMap((s) => [...s]));
    let overlap = 0;
    for (const c of allCuisines) {
      const count = cuisineSets.filter((s) => s.has(c)).length;
      if (count >= 2) overlap++;
    }
    cuisineScore = Math.round((overlap / Math.max(allCuisines.size, 1)) * 100);
  }

  const ambiancePrefs = participants.map((p) => p.preferences.ambiancePreference);
  const ambianceCounts = new Map<string, number>();
  for (const a of ambiancePrefs) {
    ambianceCounts.set(a, (ambianceCounts.get(a) || 0) + 1);
  }
  const maxAmbiance = Math.max(...ambianceCounts.values());
  const ambianceScore = Math.round((maxAmbiance / participants.length) * 100);

  let scheduleScore = 85;
  const hasLateStart = participants.some((p) =>
    p.preferences.schedule.available.some((s) => s.includes("20:00"))
  );
  const hasEarlyEnd = participants.some((p) =>
    p.preferences.schedule.available.some((s) => s.includes("22:30"))
  );
  if (hasLateStart && hasEarlyEnd) scheduleScore = 60;

  const overall = Math.round(
    (dietaryScore * 0.3 +
      cuisineScore * 0.25 +
      ambianceScore * 0.2 +
      scheduleScore * 0.25)
  );

  return { dietary: dietaryScore, cuisine: cuisineScore, ambiance: ambianceScore, schedule: scheduleScore, overall };
}

function BarRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/50">{label}</span>
        <span className="text-xs font-mono text-white/40">{value}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#A0784A] transition-all duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function PreferenceGraph({ participants }: PreferenceGraphProps) {
  const scores = useMemo(() => computeOverlap(participants), [participants]);
  const complexity = 100 - scores.overall;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-medium uppercase tracking-[0.12em] text-white/30">
          Coordination Complexity
        </h3>
        <span className="text-2xl font-mono font-medium text-[#A0784A]">
          {complexity}%
        </span>
      </div>

      <div className="space-y-3">
        <BarRow label="Dietary constraints" value={100 - scores.dietary} />
        <BarRow label="Cuisine divergence" value={100 - scores.cuisine} />
        <BarRow label="Ambiance conflict" value={100 - scores.ambiance} />
        <BarRow label="Schedule tension" value={100 - scores.schedule} />
      </div>

      <p className="text-[11px] text-white/30 italic">
        Ensemble resolves the gaps
      </p>
    </div>
  );
}
