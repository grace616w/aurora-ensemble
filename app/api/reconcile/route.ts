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

const travelFallbackResult: ReconciliationResult = {
  groupAnalysis: {
    hardConstraints: [
      "Must accommodate: vegetarian + no dairy (Priya), vegetarian (Elena), pescatarian (Sarah), no pork (James)",
      "Wheelchair-accessible ground-floor unit required (Elena)",
      "Group overlap: May 16-19 (Marcus and David unavailable May 15)",
      "6 guests across 3 departure airports (TEB, JFK, LAX) — multi-origin flight coordination",
      "Minimum 5 rooms or multi-bedroom villa configuration",
    ],
    softConstraints: [
      "Sarah prefers boutique/beachfront; Marcus prefers resort with golf/marina; David prefers resort",
      "Elena wants spa-focused wellness; James and Priya prefer quiet/boutique",
      "Sarah's Oura shows high stress + low recovery — system recommends wellness-oriented property",
      "Budget delta: 3 members at $$$$ tier, 3 guests at $$$ — lodging split model needed",
    ],
    scheduleOverlap:
      "May 16–19 (3 nights confirmed for all 4). Sarah and Elena can arrive May 15 for an extra night. Marcus joins May 16.",
    primaryTension:
      "Property type split — Sarah wants boutique beachfront, Marcus wants full-service resort with golf. Elena's accessibility requirement eliminates several villa options.",
  },
  rankedVenues: [
    {
      venueId: "lodge-3",
      rank: 1,
      confidenceScore: 87,
      reasoning:
        "Grace Bay Club is the strongest fit for this group. It offers the resort amenities Marcus wants (golf nearby, multiple restaurants) while being on Grace Bay Beach for Sarah. The Estate Suites are ground-floor accessible for Elena. Multiple on-site restaurants handle all dietary requirements. Aurora Edge perks include suite upgrades and private cabanas — ideal for a decompression trip.",
      compromises: [
        { participantId: "sarah-chen", participantName: "Sarah Chen", compromise: "Not the boutique feel she prefers, but the Estate section is intimate and separate from the main resort" },
        { participantId: "elena-chen", participantName: "Elena Chen", compromise: "Resort rather than spa-focused, but the spa is excellent and ground-floor access confirmed" },
      ],
      unresolvable: [],
    },
    {
      venueId: "lodge-2",
      rank: 2,
      confidenceScore: 82,
      reasoning:
        "COMO Parrot Cay is a private island with world-class wellness — perfect for Sarah's high-stress recovery needs and Elena's spa preference. The farm-to-table dining handles all dietary constraints. However, the private island format means no golf for Marcus, and the Two-Bedroom Beach Houses may not accommodate 4 guests without booking two units.",
      compromises: [
        { participantId: "marcus-rivera", participantName: "Marcus Rivera", compromise: "No golf, no marina — limited activity options beyond wellness and water sports" },
        { participantId: "james-whitfield", participantName: "James Whitfield", compromise: "Private island may feel isolating; limited restaurant variety" },
      ],
      unresolvable: [],
    },
    {
      venueId: "lodge-1",
      rank: 3,
      confidenceScore: 78,
      reasoning:
        "Amanyara is the most luxurious option with extraordinary privacy and a pristine reef. The Pool Villas offer ground-floor access for Elena. However, it's located on the remote Northwest Point — 45 minutes from the airport and far from any town. The $3,200/night rate creates a significant budget gap for the non-member guests.",
      compromises: [
        { participantId: "marcus-rivera", participantName: "Marcus Rivera", compromise: "Remote location, no golf, limited nightlife or social energy" },
        { participantId: "james-whitfield", participantName: "James Whitfield", compromise: "At $3,200/night, significantly above guest budget tier — cost-sharing model needed" },
        { participantId: "elena-chen", participantName: "Elena Chen", compromise: "Remote location makes medical access more difficult if needed" },
      ],
      unresolvable: ["Budget disparity: $3,200/night exceeds guest tier by ~3x. Requires member to subsidize or split-rate arrangement"],
    },
    {
      venueId: "lodge-4",
      rank: 4,
      confidenceScore: 62,
      reasoning:
        "The Shore Club on Long Bay has Nobu for excellent Japanese/pescatarian dining and a social energy Marcus would enjoy. However, the 'lively' ambiance directly conflicts with James's quiet preference and the decompression vibe. It's not available until May 16, which works for the group overlap but eliminates Sarah and Elena's early arrival.",
      compromises: [
        { participantId: "james-whitfield", participantName: "James Whitfield", compromise: "Lively atmosphere directly conflicts with quiet preference" },
        { participantId: "sarah-chen", participantName: "Sarah Chen", compromise: "Party-adjacent energy doesn't match decompression vibe; Long Bay isn't beachfront in the same way" },
      ],
      unresolvable: ["Ambiance mismatch with the stated 'decompression' trip purpose"],
    },
    {
      venueId: "lodge-5",
      rank: 5,
      confidenceScore: 52,
      reasoning:
        "Wymara is a solid boutique option on Grace Bay at $950/night — the most budget-friendly for the group. However, the $$$ tier falls below the members' minimum, room variety is limited, and the intimate scale may not have enough ground-floor accessible inventory for Elena.",
      compromises: [
        { participantId: "sarah-chen", participantName: "Sarah Chen", compromise: "Below her $$$$ price floor — may feel like a downgrade" },
        { participantId: "marcus-rivera", participantName: "Marcus Rivera", compromise: "No resort amenities, no golf, limited dining options" },
      ],
      unresolvable: ["Below members' $$$$ price floor", "Accessibility confirmation needed — limited ground-floor inventory"],
    },
  ],
  escalationRequired: true,
  escalationReason:
    "Two issues require Lifestyle Strategist intervention: (1) Marcus cannot arrive until May 16, but the group wants 4 nights. A staggered check-in needs to be negotiated with the property — confirm they'll hold his room from May 15 or arrange a 3-night rate. (2) The budget split between members ($$$$ tier) and guests ($$$ tier) needs a tactful cost-sharing arrangement. Recommend the member covers the base booking and guests contribute a flat per-night amount.",
  escalationContext:
    "Group of 6 (3 Aurora members + 3 guests) across 3 airports (TEB, JFK, LAX) planning a post-fundraise decompression trip to Turks & Caicos, May 15-19. Top recommendation: Grace Bay Club (Estate Suite configuration). Key logistics: Marcus Rivera and David Kim arrive May 16 (one day late) — negotiate room holds or staggered check-in. Elena Chen (guest, Sarah's partner) requires wheelchair-accessible ground-floor unit — confirm specific room assignment. Priya Sharma has vegetarian + no dairy requirements — verify property can accommodate across all meal periods. Sarah Chen's wearable data shows elevated stress and low recovery — suggest wellness package add-on. Budget note: 3 members at $$$$ tier, 3 guests at $$$ — recommend member-subsidized booking with guest flat-rate contribution.",
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
      // Choose fallback based on event type
      const isTravel = event?.type === "travel" || venues?.some?.((v: Venue) => v.venueType === "lodging");
      return NextResponse.json(isTravel ? travelFallbackResult : fallbackResult);
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
