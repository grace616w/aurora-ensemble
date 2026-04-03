import { MemberProfile, Venue, ReconciliationResult, EventDetails } from "./types";

export function buildReconciliationPrompt(
  event: EventDetails,
  participants: MemberProfile[],
  venues: Venue[]
): string {
  return `You are an AI concierge for Aurora, a premium lifestyle management platform. Your task is to analyze a group's preferences and recommend the best venue options for their event.

## Event Details
${JSON.stringify(event, null, 2)}

## Participant Profiles
${JSON.stringify(
  participants.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    isAuroraMember: p.isAuroraMember,
    preferences: p.preferences,
  })),
  null,
  2
)}

## Available Venues
${JSON.stringify(venues, null, 2)}

## Instructions

Analyze the group's preferences and produce a structured recommendation. You must:

1. Identify all HARD constraints (dietary restrictions, accessibility needs, schedule conflicts) that cannot be compromised
2. Identify SOFT constraints (cuisine preferences, ambiance preferences, neighborhood preferences) that can be negotiated
3. Calculate the schedule overlap window across all participants
4. Score each venue against the full constraint set on a 0-100 confidence scale
5. Rank venues from best to worst fit
6. For each venue, explain what compromises each participant would need to make
7. Flag any IRRECONCILABLE conflicts that require human intervention from a Lifestyle Strategist

A confidence score above 80 means the venue works well for the group with minor compromises.
A score of 60-80 means workable but notable compromises needed.
A score below 60 means significant issues.

If any hard constraints cannot be met, or if the schedule window is too tight for the event type, flag escalation as required.

Respond with ONLY valid JSON matching this exact structure (no markdown, no code fences):

{
  "groupAnalysis": {
    "hardConstraints": ["string array of non-negotiable constraints"],
    "softConstraints": ["string array of preference-level constraints"],
    "scheduleOverlap": "description of the overlapping availability window",
    "primaryTension": "the main conflict or tension point in this group"
  },
  "rankedVenues": [
    {
      "venueId": "venue-id",
      "rank": 1,
      "confidenceScore": 85,
      "reasoning": "2-3 sentence explanation of why this venue works or doesn't",
      "compromises": [
        {
          "participantId": "participant-id",
          "participantName": "Name",
          "compromise": "what this person gives up or accepts"
        }
      ],
      "unresolvable": ["any issues that cannot be fixed"]
    }
  ],
  "escalationRequired": false,
  "escalationReason": "only if escalationRequired is true",
  "escalationContext": "pre-packaged briefing for the Lifestyle Strategist, only if escalation required"
}`;
}

export async function runReconciliation(
  event: EventDetails,
  participants: MemberProfile[],
  venues: Venue[]
): Promise<ReconciliationResult> {
  const prompt = buildReconciliationPrompt(event, participants, venues);

  const response = await fetch("/api/reconcile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`Reconciliation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data as ReconciliationResult;
}
