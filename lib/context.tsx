"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  EventDetails,
  MemberProfile,
  ReconciliationResult,
  VoteState,
  Venue,
} from "./types";
import {
  defaultEventDetails,
  members as allMembers,
  venues as dinnerVenues,
  travelEventDetails,
  travelMembers,
  lodgings,
  experienceEventDetails,
  experienceMembers,
  experienceVenues,
  wellnessEventDetails,
  wellnessMembers,
  wellnessVenues,
} from "./mock-data";

interface AppState {
  event: EventDetails;
  setEvent: (event: EventDetails) => void;
  participants: MemberProfile[];
  setParticipants: (participants: MemberProfile[]) => void;
  addParticipant: (participant: MemberProfile) => void;
  removeParticipant: (id: string) => void;
  reconciliationResult: ReconciliationResult | null;
  setReconciliationResult: (result: ReconciliationResult | null) => void;
  activeVenues: Venue[];
  votes: VoteState;
  setVote: (participantId: string, venueId: string, vote: "up" | "down" | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  loadScenario: (type: "dinner" | "travel" | "experience" | "wellness") => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [event, setEvent] = useState<EventDetails>(defaultEventDetails);
  const [participants, setParticipants] = useState<MemberProfile[]>(allMembers);
  const [activeVenues, setActiveVenues] = useState<Venue[]>(dinnerVenues);
  const [reconciliationResult, setReconciliationResult] =
    useState<ReconciliationResult | null>(null);
  const [votes, setVotes] = useState<VoteState>({});
  const [currentStep, setCurrentStep] = useState(0);

  const addParticipant = useCallback((participant: MemberProfile) => {
    setParticipants((prev) => {
      if (prev.find((p) => p.id === participant.id)) return prev;
      return [...prev, participant];
    });
  }, []);

  const removeParticipant = useCallback((id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setVote = useCallback(
    (participantId: string, venueId: string, vote: "up" | "down" | null) => {
      setVotes((prev) => ({
        ...prev,
        [participantId]: {
          ...prev[participantId],
          [venueId]: vote,
        },
      }));
    },
    []
  );

  const loadScenario = useCallback((type: "dinner" | "travel" | "experience" | "wellness") => {
    setReconciliationResult(null);
    setVotes({});
    setCurrentStep(1);
    if (type === "travel") {
      setEvent(travelEventDetails);
      setParticipants(travelMembers);
      setActiveVenues(lodgings);
    } else if (type === "experience") {
      setEvent(experienceEventDetails);
      setParticipants(experienceMembers);
      setActiveVenues(experienceVenues);
    } else if (type === "wellness") {
      setEvent(wellnessEventDetails);
      setParticipants(wellnessMembers);
      setActiveVenues(wellnessVenues);
    } else {
      setEvent(defaultEventDetails);
      setParticipants(allMembers);
      setActiveVenues(dinnerVenues);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        event,
        setEvent,
        participants,
        setParticipants,
        addParticipant,
        removeParticipant,
        reconciliationResult,
        setReconciliationResult,
        activeVenues,
        votes,
        setVote,
        currentStep,
        setCurrentStep,
        loadScenario,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
