export interface HealthSignals {
  stressLevel: "low" | "moderate" | "high";
  sleepScore: number;
  recoveryScore: number;
}

export interface MemberProfile {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
  isAuroraMember: boolean;
  preferences: {
    dietary: string[];
    cuisineAffinities: string[];
    cuisineAversions: string[];
    ambiancePreference: string;
    priceFloor: string;
    neighborhoodPreferences: string[];
    neighborhoodAvoidances: string[];
    accessibility: string[];
    schedule: {
      available: string[];
      blocked: string[];
    };
    healthSignals?: HealthSignals;
  };
}

export interface Venue {
  id: string;
  name: string;
  subtitle?: string;
  cuisine: string;
  neighborhood: string;
  priceRange: string;
  ambiance: string;
  privateRoom: boolean;
  capacity: number;
  dietaryAccommodations: string[];
  auroraEdge: boolean;
  auroraPerks?: string;
  availableSlots: string[];
  confidenceScore?: number;
  conflictsResolved?: string[];
  conflictsUnresolved?: string[];
  // Travel-specific fields
  venueType?: "restaurant" | "lodging" | "experience" | "wellness";
  nightlyRate?: string;
  roomTypes?: string[];
  features?: string[];
}

export interface Compromise {
  participantId: string;
  participantName?: string;
  compromise: string;
}

export interface RankedVenue {
  venueId: string;
  rank: number;
  confidenceScore: number;
  reasoning: string;
  compromises: Compromise[];
  unresolvable: string[];
}

export interface GroupAnalysis {
  hardConstraints: string[];
  softConstraints: string[];
  scheduleOverlap: string;
  primaryTension: string;
}

export interface ReconciliationResult {
  groupAnalysis: GroupAnalysis;
  rankedVenues: RankedVenue[];
  escalationRequired: boolean;
  escalationReason?: string;
  escalationContext?: string;
}

export interface EventDetails {
  type: "dinner" | "travel" | "experience" | "wellness";
  location: string;
  date: string;
  timeWindow: string;
  groupSize: number;
  vibe: string;
}

// ── Travel types ──

export interface FlightInfo {
  participantId: string;
  participantName: string;
  departureAirport: string;
  departureCity: string;
  flightType: "commercial" | "private";
  flightNumber?: string;
  departureTime: string;
  arrivalTime: string;
  arrivalAirport: string;
  transferGroup: number;
  status: "confirmed" | "delayed" | "cancelled";
}

export interface DisruptionScenario {
  triggerId: string;
  triggerLabel: string;
  affectedParticipants: string[];
  originalArrival: string;
  newArrival: string;
  delayMinutes: number;
  cause: string;
  cascadingImpacts: { text: string; severity: "red" | "amber" | "green" | "blue" }[];
  resolutionOptions: {
    id: string;
    title: string;
    description: string;
    confidence: number;
    tradeoff: string;
  }[];
  strategistBriefing: string;
}

export type Vote = "up" | "down" | null;

export interface VoteState {
  [participantId: string]: {
    [venueId: string]: Vote;
  };
}
