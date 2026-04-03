import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildReconciliationPrompt } from "@/lib/reconciliation-engine";
import { EventDetails, MemberProfile, Venue, ReconciliationResult } from "@/lib/types";

const fallbackResult: ReconciliationResult = {
  groupAnalysis: {
    hardConstraints: [
      "Must accommodate: vegan (Anika), pescatarian + no shellfish (Sarah), no pork (James)",
      "Gluten-free required for Anika",
      "All participants available 20:00-22:30 (2.5hr overlap window)",
      "Minimum price tier: $$$$",
    ],
    softConstraints: [
      "3/4 prefer intimate or private dining; Marcus prefers lively",
      "Cuisine tension: Marcus favors steakhouse/Italian, which conflicts with Anika's vegan needs",
      "Neighborhood preferences cluster around West Village/SoHo, but Marcus prefers Tribeca/FiDi",
      "Sarah and Anika prefer Japanese; Marcus prefers Italian/American",
    ],
    scheduleOverlap:
      "20:00–22:30 (2.5-hour window). Marcus can't arrive before 20:00, Anika needs to leave by 22:30.",
    primaryTension:
      "Cuisine split — Marcus's steakhouse preference is fundamentally incompatible with Anika's vegan dietary requirements. The group needs a cuisine that can serve exceptional dishes across all dietary constraints.",
  },
  rankedVenues: [
    {
      venueId: "venue-3",
      rank: 1,
      confidenceScore: 89,
      reasoning:
        "Shukette is the strongest fit for this group. Mediterranean cuisine naturally accommodates all dietary requirements — vegan, pescatarian, no shellfish, no pork, and gluten-free — without feeling like a compromise. The SoHo location works for both the West Village and Tribeca contingents. The private dining room satisfies Anika's preference while the overall atmosphere has enough energy for Marcus. Aurora Edge perks (custom tasting menu, sommelier pairing) elevate the experience for the Series B celebration.",
      compromises: [
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "Not his first-choice cuisine (prefers steakhouse/Italian), but Mediterranean offers robust enough flavors and the lively atmosphere partially aligns with his preference",
        },
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "Not Japanese or French, but Mediterranean is in her affinity list and the SoHo location is in her preferred zone",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "venue-1",
      rank: 2,
      confidenceScore: 82,
      reasoning:
        "Nami Nori aligns with Sarah and Anika's Japanese cuisine preference and handles all dietary requirements well. The West Village location is ideal for both. Aurora Edge perks include a complimentary sake flight and dedicated omakase counter, which makes the celebration special. However, the intimate setting may not fully satisfy Marcus, and the hand-roll format may feel less celebratory for a Series B dinner.",
      compromises: [
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "Japanese is not in his cuisine affinities, and the intimate setting doesn't match his lively preference",
        },
        {
          participantId: "james-whitfield",
          participantName: "James Whitfield",
          compromise:
            "Limited info on cuisine preferences, but the quieter venue aligns with his ambiance preference",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "venue-8",
      rank: 3,
      confidenceScore: 78,
      reasoning:
        "abcV is Jean-Georges Vongerichten's vegetable-forward concept, offering exceptional plant-based cuisine that naturally satisfies all dietary constraints. The private dining room and Flatiron location are acceptable. However, the fully vegetable-forward menu may feel too restrictive for Marcus, and the location is outside the group's preferred neighborhoods.",
      compromises: [
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "Vegetable-forward menu is far from his steakhouse preference — significant compromise on cuisine",
        },
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "Flatiron is outside her preferred SoHo/West Village neighborhoods",
        },
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "Flatiron is outside his preferred Tribeca/FiDi neighborhoods",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "venue-4",
      rank: 4,
      confidenceScore: 65,
      reasoning:
        "Le Coucou is an excellent French restaurant in SoHo with a private room, which hits Sarah's French cuisine affinity and the group's location preferences. However, traditional French cuisine presents real challenges for Anika's vegan and gluten-free requirements — the restaurant notes 'limited vegan' options, which is a significant risk for a group dinner.",
      compromises: [
        {
          participantId: "anika-patel",
          participantName: "Anika Patel",
          compromise:
            "Limited vegan options at a French restaurant — would need to confirm adaptability in advance",
        },
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "French isn't his preference, though the upscale setting is appropriate for the occasion",
        },
      ],
      unresolvable: [
        "Anika's vegan + gluten-free requirements may not be well-served by the traditional French menu",
      ],
    },
    {
      venueId: "venue-5",
      rank: 5,
      confidenceScore: 38,
      reasoning:
        "Cote would be Marcus's top choice as a Korean steakhouse, but it fundamentally cannot accommodate Anika's vegan dietary requirements — the restaurant itself notes 'no vegan options.' This makes it unsuitable for the group despite its other strengths (private room, lively atmosphere, Aurora Edge perks).",
      compromises: [
        {
          participantId: "anika-patel",
          participantName: "Anika Patel",
          compromise:
            "No vegan options available — this is a hard constraint failure",
        },
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "Steakhouse is in her cuisine aversions list, and limited pescatarian options",
        },
      ],
      unresolvable: [
        "Cannot accommodate Anika's vegan dietary requirement",
        "Conflicts with Sarah's steakhouse aversion",
      ],
    },
    {
      venueId: "venue-2",
      rank: 6,
      confidenceScore: 72,
      reasoning:
        "Via Carota is a beloved West Village Italian spot that could satisfy Marcus's Italian preference while offering decent vegan and gluten-free options. However, no private room and a lively atmosphere won't suit Anika's private dining preference. The max capacity of 6 is tight for a comfortable group dinner with the celebratory vibe they want.",
      compromises: [
        {
          participantId: "anika-patel",
          participantName: "Anika Patel",
          compromise:
            "No private dining available, and Italian vegan options may be limited",
        },
        {
          participantId: "james-whitfield",
          participantName: "James Whitfield",
          compromise:
            "Prefers quieter venues, but Via Carota is notably lively",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "venue-7",
      rank: 7,
      confidenceScore: 55,
      reasoning:
        "Atomix offers an extraordinary tasting experience with a private dining format. However, its Midtown East location is in Sarah's avoidance zone, and the limited vegan accommodation presents risk for Anika. The single 19:00 seating conflicts with Marcus's 20:00 availability.",
      compromises: [
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "Midtown East is in her neighborhood avoidance list",
        },
        {
          participantId: "anika-patel",
          participantName: "Anika Patel",
          compromise:
            "Limited vegan accommodation at a Korean tasting menu",
        },
      ],
      unresolvable: [
        "Only available at 19:00, but Marcus cannot arrive until 20:00 — schedule conflict",
      ],
    },
    {
      venueId: "venue-6",
      rank: 8,
      confidenceScore: 52,
      reasoning:
        "Avant Garden handles all dietary requirements perfectly as a fully plant-forward restaurant. However, its $$$ price range falls below the group's $$$$ minimum, the East Village location isn't preferred by anyone, and the 6-person capacity with no private room limits the experience. This doesn't match the celebratory, premium energy of a Series B dinner.",
      compromises: [
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "Plant-forward is in his cuisine aversions, East Village isn't preferred, and below price floor",
        },
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "East Village isn't in preferred neighborhoods, intimate but no private option",
        },
      ],
      unresolvable: [
        "Below the group's $$$$ price floor — may not match the premium expectation",
      ],
    },
  ],
  escalationRequired: true,
  escalationReason:
    "The 2.5-hour window (20:00–22:30) is tight for a celebratory 4-course dinner. Most fine dining venues in this tier recommend 2.5–3 hours minimum, and with cocktails and toasts for a Series B celebration, the group may feel rushed. A Lifestyle Strategist should negotiate flexible timing with the selected venue or explore whether Anika could stay slightly later.",
  escalationContext:
    "Group of 4 (3 Aurora members + 1 guest) celebrating a Series B close. Schedule constraint: Marcus arrives at 20:00, Anika departs by 22:30, creating a 2.5hr window. Top recommendation is Shukette (Mediterranean, SoHo) with private dining — confirm they can execute a complete tasting menu experience within 2.5 hours. Alternative: negotiate with Nami Nori for an abbreviated omakase format. Secondary concern: verify Anika's vegan/GF needs can be met with advance notice at the selected venue. James Whitfield (guest, not Aurora member) has a minimal preference profile — may benefit from intake questionnaire completion before final booking.",
};

export async function POST(request: Request) {
  try {
    const { event, participants, venues } = await request.json();
    const prompt = buildReconciliationPrompt(event, participants, venues);

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Return fallback result when no API key is set
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json(fallbackResult);
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse the JSON response
    let result: ReconciliationResult;
    try {
      result = JSON.parse(content.text);
    } catch {
      // If Claude's response isn't valid JSON, try to extract JSON from it
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse reconciliation response as JSON");
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Reconciliation API error:", error);
    // Return fallback on any error
    return NextResponse.json(fallbackResult);
  }
}
