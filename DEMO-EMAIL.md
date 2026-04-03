# Demo Email

**Subject:** Aurora Ensemble — a prototype for the multi-party coordination gap

---

Hi [Name],

I built something for Aurora.

Your members don't dine alone. They travel with partners, celebrate with co-founders, host clients. But Aurora's preference graph is single-player — it breaks the moment a member says "plan this for four of us."

**Aurora Ensemble** is a working prototype that solves this. It's a 4-step flow:

1. **Create** — Define the event (dinner, trip, experience), set the vibe
2. **Participants** — Pull in Aurora members with full preference profiles + invite external guests with a lightweight intake
3. **Reconcile** — AI analyzes every constraint across the group (dietary, cuisine, ambiance, schedule, wearable data) and ranks venue options with confidence scores, transparent reasoning, and explicit tradeoff explanations
4. **Propose** — Group votes on the top recommendations. When there's a clear winner, one tap to book.

The key insight: **the system knows where it can't solve** and pre-packages a briefing for your Lifestyle Strategists — so humans spend time on judgment, not logistics.

**Try it:** [INSERT LINK]

Click through the demo scenario: a Series B celebration dinner in NYC with a vegan, a pescatarian, a steakhouse loyalist, and a guest who isn't an Aurora member. Watch how it navigates the constraints and surfaces exactly where a human needs to step in.

The prototype uses Aurora's real brand, Claude API integration for the reconciliation engine, and mock data modeled on your member personas.

Happy to walk through it live or answer any questions.

Best,
[Your name]

---

# Problem / Solution Statement

## The Problem: The Multi-Party Coordination Gap

Aurora's product architecture is built around a single-member preference graph. This works brilliantly for individual requests — "book me a table tonight" or "find me a flight to Aspen."

But high-performance individuals don't operate in isolation. They have partners, families, assistants, business associates, and co-investors. The moment a member says *"plan a dinner for four of us"* or *"organize a group trip,"* the single-player system breaks down:

- **Constraint explosion**: One person is vegan and gluten-free. Another is a steakhouse loyalist. A third can't arrive before 8pm. A fourth isn't even an Aurora member — the system has zero data on them. These constraints are multiplicative, not additive.

- **Preference conflicts**: Cuisine affinities diverge. Ambiance preferences clash (intimate vs. lively). Neighborhood preferences don't overlap. There's no mechanism to *reconcile* these conflicts — only to surface them one at a time.

- **The phantom user problem**: When a member invites non-members into a group experience, they become data ghosts. The system can't optimize for people it doesn't know. Every group event includes at least one.

- **Human bottleneck**: Today, Lifestyle Strategists manually untangle these conflicts. They call members, cross-reference preferences, research venues, and make judgment calls — burning hours on logistics that could be algorithmically resolved.

This isn't an edge case. Group coordination is *the default mode* for Aurora's target demographic. Post-exit founders celebrate with teams. Athletes dine with agents. Family offices plan multi-generational trips. Every group event is a missed opportunity for the system to demonstrate its intelligence.

## The Solution: Aurora Ensemble

Ensemble extends Aurora's preference graph from single-player to multi-party. It introduces a shared coordination layer that:

### 1. Ingests all participants simultaneously
Aurora members contribute their full preference graphs automatically — dietary restrictions, cuisine affinities, ambiance preferences, neighborhood preferences, schedule availability, and even wearable health data (Oura/Whoop recovery and stress scores for timing optimization). Non-members receive a lightweight intake link that captures the minimum viable preference set.

### 2. Reconciles constraints algorithmically
The AI engine (powered by Claude) separates hard constraints (dietary, accessibility, schedule) from soft constraints (cuisine preference, ambiance, neighborhood). It identifies the overlap zone, scores venues against the complete constraint set, and produces ranked recommendations with:
- Confidence scores (0-100) for each option
- Per-participant compromise explanations ("Not Marcus's first choice cuisine, but strong Italian options")
- Transparent reasoning for every ranking

### 3. Surfaces irreconcilable conflicts with pre-packaged human handoffs
When the AI *cannot* resolve a conflict — a 2.5-hour schedule window that's too tight for a 4-course dinner, or a venue that can't accommodate a hard dietary requirement — it doesn't silently fail. It flags the escalation, explains exactly what it can't solve, and pre-packages a briefing for the Lifestyle Strategist: participant context, constraint summary, what's been tried, and recommended next steps.

This is the critical architectural insight: **the handoff signal is the product.** It's the difference between "AI that tries to do everything" and "AI that knows its limits and makes humans more effective."

### 4. Enables group decision-making
The proposal page presents the top 3 recommendations as a shareable view where all participants can vote. The organizer sees a real-time tally and can confirm the booking with one tap. This also creates a natural acquisition loop — every non-member invited into a group experience gets their first taste of Aurora's intelligence.

## Why This Matters for Aurora

- **Revenue expansion**: Group experiences are 3-5x the transaction value of individual requests
- **Strategist leverage**: Automating the constraint reconciliation frees Lifestyle Strategists to spend time on high-judgment, relationship-building moments
- **Network effects**: Every group event pulls non-members into Aurora's orbit through the guest intake flow — a viral acquisition wedge that doesn't exist today
- **Defensibility**: A multi-party preference reconciliation engine is exponentially harder to replicate than a single-user concierge
- **Data compounding**: Group events generate cross-referenced preference data that strengthens every individual member's graph
