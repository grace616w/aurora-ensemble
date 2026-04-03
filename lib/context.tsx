"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  EventDetails,
  MemberProfile,
  ReconciliationResult,
  VoteState,
} from "./types";
import { defaultEventDetails, members as allMembers } from "./mock-data";

interface AppState {
  event: EventDetails;
  setEvent: (event: EventDetails) => void;
  participants: MemberProfile[];
  setParticipants: (participants: MemberProfile[]) => void;
  addParticipant: (participant: MemberProfile) => void;
  removeParticipant: (id: string) => void;
  reconciliationResult: ReconciliationResult | null;
  setReconciliationResult: (result: ReconciliationResult | null) => void;
  votes: VoteState;
  setVote: (participantId: string, venueId: string, vote: "up" | "down" | null) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [event, setEvent] = useState<EventDetails>(defaultEventDetails);
  const [participants, setParticipants] = useState<MemberProfile[]>(allMembers);
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
        votes,
        setVote,
        currentStep,
        setCurrentStep,
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
