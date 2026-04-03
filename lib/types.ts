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

export type Vote = "up" | "down" | null;

export interface VoteState {
  [participantId: string]: {
    [venueId: string]: Vote;
  };
}
