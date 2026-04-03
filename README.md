# Aurora Ensemble — Group Experience Coordination

A working prototype demonstrating multi-party experience coordination for [Aurora](https://joinaurora.co), an AI-powered premium lifestyle management platform.

## The Problem

Aurora's product today is built around **single-member preference graphs**. When a member wants to plan a dinner, trip, or experience for a group, the system has no mechanism to ingest multiple participants' preferences, reconcile conflicts, propose ranked options with reasoning, or surface where a human Lifestyle Strategist needs to step in.

## What This Prototype Does

Aurora Ensemble is a 4-step workflow that coordinates group experiences:

1. **Create Experience** — Define the event type, location, date, and vibe
2. **Add Participants** — Import Aurora member profiles (with full preference + wearable data) and invite external guests
3. **AI Reconciliation** — Claude analyzes all participant constraints, scores venues against the multi-person constraint set, and flags irreconcilable conflicts
4. **Group Proposal** — Shareable proposal with ranked venue options and group voting

### Key Features

- **Multi-dimensional constraint reconciliation** across dietary, cuisine, ambiance, schedule, and neighborhood preferences
- **Health-aware coordination** that factors in wearable data (Oura, Whoop) for timing optimization
- **Confidence scoring** with transparent reasoning for each venue recommendation
- **Escalation detection** that identifies when AI can't resolve a conflict and pre-packages context for a human Lifestyle Strategist
- **Guest intake flow** that demonstrates how non-members get pulled into Aurora's orbit through group events

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment (optional — works without API key using mock data)
cp .env.example .env.local
# Add your Anthropic API key to .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's Real vs. Simulated

| Component | Status |
|---|---|
| Claude API reconciliation | **Real** — sends structured preference data to Claude and receives scored, reasoned venue recommendations |
| Member preference profiles | Simulated — hardcoded mock data representing 3 Aurora members + 1 guest |
| Venue data | Simulated — 8 pre-loaded NYC restaurants with realistic attributes |
| Wearable health data | Simulated — mock Oura/Whoop scores |
| Preference intake for guests | Simulated — CTA shows a toast notification |
| Voting | Local state only — no persistence |
| Booking confirmation | Simulated — no real reservation system |

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Claude API via `@anthropic-ai/sdk`
- Lucide React icons
- Manrope + JetBrains Mono (Google Fonts)

## Architecture

```
app/
  page.tsx              → Landing/dashboard
  create/page.tsx       → Step 1: event creation
  participants/page.tsx → Step 2: participant management
  reconcile/page.tsx    → Step 3: AI reconciliation output
  proposal/page.tsx     → Step 4: group proposal + voting
  api/reconcile/route.ts → Claude API integration

components/
  ui/                   → Design system primitives
  participant-card.tsx  → Member/guest preference card
  venue-card.tsx        → Ranked venue recommendation
  preference-graph.tsx  → Group compatibility visualization
  confidence-badge.tsx  → AI confidence score indicator
  handoff-banner.tsx    → Lifestyle Strategist escalation UI

lib/
  types.ts              → TypeScript interfaces
  mock-data.ts          → Pre-built profiles and venues
  context.tsx           → App state (React Context)
  reconciliation-engine.ts → Claude prompt builder
```
