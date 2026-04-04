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

const experienceFallbackResult: ReconciliationResult = {
  groupAnalysis: {
    hardConstraints: [
      "Must accommodate: vegetarian (Lila), pescatarian + no shellfish (Sarah), no pork (James)",
      "All participants available 15:00-18:00 (3hr overlap — James departs by 18:00, Marcus arrives at 15:00)",
      "Minimum 4-person capacity with semi-private or private setting",
      "Walking accessibility required — Lila prefers minimal transit between venues",
    ],
    softConstraints: [
      "Sarah and Lila prefer intimate/quiet settings; Marcus prefers lively atmosphere",
      "Lila has deep contemporary art knowledge — generic gallery tours will feel surface-level for her",
      "James has limited art background — experience should be accessible, not intimidating",
      "Wine component important for Sarah and Marcus; Lila prefers natural wines specifically",
      "Neighborhood cluster: SoHo/Chelsea preferred by 3 of 4 participants",
    ],
    scheduleOverlap:
      "15:00–18:00 (3-hour window). Marcus cannot arrive before 15:00, James must leave by 18:00. Sarah and Lila available from 14:00 — could do a pre-experience gallery walk.",
    primaryTension:
      "Expertise gap — Lila is a professional art collector who will find standard gallery tours superficial, while James has minimal art exposure and may feel alienated by insider-level discourse. The experience needs to engage both without condescending to either.",
  },
  rankedVenues: [
    {
      venueId: "exp-1",
      rank: 1,
      confidenceScore: 91,
      reasoning:
        "The Curator's Eye in SoHo is the strongest fit. The private viewing format with a dedicated curator allows the tour to be calibrated to the group's mixed expertise levels — Lila can engage with the curator on technique and provenance while James gets accessible context. The sommelier-led wine pairing bridges the art and social elements. SoHo location is in everyone's preferred zone. Aurora Edge perks (after-hours access, private collection) will make Lila feel this is a serious art experience, not a tourist activity.",
      compromises: [
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "Intimate gallery setting is quieter than his lively preference, but the wine pairing adds social energy",
        },
        {
          participantId: "james-whitfield",
          participantName: "James Whitfield",
          compromise:
            "Art-heavy experience may feel outside his comfort zone, but the private format means no pressure to perform knowledge",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "exp-5",
      rank: 2,
      confidenceScore: 85,
      reasoning:
        "The Glass House offers a unique rooftop sculpture garden with champagne tasting — the outdoor setting and live glassblowing demo make it experiential rather than purely intellectual, which helps James engage. The champagne tasting is universally appealing. Aurora Edge perks include a private artist studio visit that Lila would find exceptional. Chelsea location works for the group.",
      compromises: [
        {
          participantId: "lila-okafor",
          participantName: "Lila Okafor",
          compromise:
            "Sculpture focus is less aligned with her contemporary art collecting interests than a painting/mixed-media gallery",
        },
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "15:00 start is the earliest he can arrive — no buffer time if running late",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "exp-3",
      rank: 3,
      confidenceScore: 78,
      reasoning:
        "Atelier Lumière's immersive 360-degree projections are the most universally accessible format — no art expertise required to enjoy, which eliminates the expertise-gap tension entirely. The lively atmosphere matches Marcus's preference. However, the non-private format means the group is mixed with other attendees, and Lila may find immersive digital art less substantive than traditional gallery work.",
      compromises: [
        {
          participantId: "lila-okafor",
          participantName: "Lila Okafor",
          compromise:
            "Immersive digital art may feel commercially oriented for a serious collector — less depth than a curated gallery",
        },
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "No private room — the experience is shared with other attendees, which conflicts with her intimate preference",
        },
        {
          participantId: "james-whitfield",
          participantName: "James Whitfield",
          compromise:
            "Tribeca location is outside his neutral zone, and the lively atmosphere conflicts with his quiet preference",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "exp-2",
      rank: 4,
      confidenceScore: 68,
      reasoning:
        "Vinoteca Privata leans heavily into wine over art — the private cellar tour and rare vintages would appeal strongly to Sarah and Marcus, and the food pairing handles all dietary needs. However, this is primarily a wine experience, not an art experience, which underdelivers on the stated purpose. Lila specifically came for art, and James has no particular wine interest.",
      compromises: [
        {
          participantId: "lila-okafor",
          participantName: "Lila Okafor",
          compromise:
            "Wine-primary experience doesn't match her expectation of an art-focused afternoon",
        },
        {
          participantId: "james-whitfield",
          participantName: "James Whitfield",
          compromise:
            "Limited wine knowledge may make the sommelier-led format feel exclusionary",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "exp-4",
      rank: 5,
      confidenceScore: 58,
      reasoning:
        "Galerie Noir offers fine art photography with natural wine — Lila's natural wine preference is met here, and the private viewing room is intimate. However, the $$$ price tier is below the group's standard, the 6-person capacity is tight, and the photography-only focus may feel narrow for a 3-hour afternoon. The quiet ambiance works for James but creates low energy for Marcus.",
      compromises: [
        {
          participantId: "marcus-rivera",
          participantName: "Marcus Rivera",
          compromise:
            "Quiet photography gallery is the opposite of his lively preference — may feel subdued",
        },
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "Below her $$$$ price floor — the experience may feel understated for the occasion",
        },
      ],
      unresolvable: [
        "Advance booking for The Curator's Eye private collection requires 10-day notice — booking deadline is April 8, cutting it close for an April 18 event",
      ],
    },
  ],
  escalationRequired: true,
  escalationReason:
    "The Curator's Eye (top recommendation) requires 10 business days advance notice for after-hours private collection access. With the event on April 18, the booking must be confirmed by April 8 at the latest. A Lifestyle Strategist should contact the gallery immediately to secure the reservation and confirm the sommelier availability for the wine pairing component.",
  escalationContext:
    "Group of 4 (2 Aurora members + 2 guests) for a private art and wine afternoon in SoHo/Chelsea, April 18. Top recommendation: The Curator's Eye (private gallery tour with sommelier-led pairing). Key tension: expertise gap between Lila Okafor (professional collector) and James Whitfield (art novice) — curator must be briefed to calibrate the tour. Booking deadline: April 8 for after-hours access. Dietary: vegetarian (Lila), pescatarian/no shellfish (Sarah), no pork (James). Marcus arrives at 15:00 — confirm experience can accommodate staggered start or plan a 14:00 pre-walk for Sarah and Lila. Wine note: Lila prefers natural wines — confirm sommelier can accommodate.",
};

const wellnessFallbackResult: ReconciliationResult = {
  groupAnalysis: {
    hardConstraints: [
      "Must accommodate: vegan + gluten-free (Anika), pescatarian + no shellfish (Sarah), vegetarian (Elena)",
      "Wheelchair-accessible ground-floor unit required (Elena)",
      "3-day retreat format: Friday April 25 through Sunday April 27",
      "Sarah's Oura data shows critically high stress (sleepScore 58, recoveryScore 45) — recovery-focused programming essential",
      "Minimum capacity for 4 guests with private or semi-private rooms",
    ],
    softConstraints: [
      "Sarah and Anika prefer spa-focused/boutique; Tom prefers resort with fitness options",
      "Tom wants access to structured fitness programming (HIIT, strength training)",
      "Anika has Ayurvedic dietary preferences — ideally the retreat offers Ayurvedic-aligned menus",
      "Elena wants spa-focused experience but needs ground-floor accessibility confirmed",
      "Budget delta: 3 members at $$$$ tier, 1 guest (Elena) at $$$ — cost-sharing consideration",
    ],
    scheduleOverlap:
      "All 4 available April 25-27 (full 3-day window). No blocked dates. Straightforward scheduling.",
    primaryTension:
      "Programming split — Sarah's wearable data strongly indicates she needs low-intensity recovery (gentle yoga, meditation, sleep optimization), but Tom wants high-intensity fitness programming (HIIT, CrossFit). A venue that leans too far toward either extreme will leave one participant underserved.",
  },
  rankedVenues: [
    {
      venueId: "well-1",
      rank: 1,
      confidenceScore: 90,
      reasoning:
        "Miraval Hudson Valley is the strongest fit. It offers both gentle recovery programming (yoga, meditation, sound healing) for Sarah's high-stress needs and active options (equine therapy, hiking) that satisfy Tom's desire for physical engagement without being purely high-intensity. The farm-to-table dining accommodates all dietary requirements including Anika's vegan/gluten-free. Aurora Edge perks include a private yoga session and dedicated wellness concierge who can customize each participant's schedule. Accessible rooms are available on the ground floor for Elena.",
      compromises: [
        {
          participantId: "tom-nakamura",
          participantName: "Tom Nakamura",
          compromise:
            "No dedicated HIIT or CrossFit programming — fitness options are more wellness-oriented (hiking, equine therapy) than performance-focused",
        },
        {
          participantId: "elena-chen",
          participantName: "Elena Chen",
          compromise:
            "Equine therapy and some outdoor activities may not be fully accessible — programming will need to be customized",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "well-3",
      rank: 2,
      confidenceScore: 84,
      reasoning:
        "CIVANA Wellness in Rhinebeck offers cutting-edge recovery modalities (cryotherapy, IV therapy, breathwork) that directly address Sarah's recovery needs. The private chef can handle all dietary constraints including Anika's Ayurvedic preferences. The boutique format feels exclusive and intimate. However, the 6-person capacity is tight, and the focus on biohacking-style wellness may feel too clinical for Elena who simply wants a relaxing spa experience.",
      compromises: [
        {
          participantId: "elena-chen",
          participantName: "Elena Chen",
          compromise:
            "Biohacking-focused wellness may feel overly clinical; she prefers traditional spa treatments. Ground-floor accessibility needs confirmation.",
        },
        {
          participantId: "tom-nakamura",
          participantName: "Tom Nakamura",
          compromise:
            "Boutique format lacks resort-scale fitness facilities — no gym, no structured training programs",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "well-2",
      rank: 3,
      confidenceScore: 76,
      reasoning:
        "Mohonk Mountain House offers the broadest range of activities — spa, hiking, lake activities, rock climbing, fitness center — which gives Tom the physical intensity he wants while Sarah can focus on spa and gentle walks. The resort scale means more dining options for varied dietary needs. However, the historic property may have limited ground-floor accessible rooms for Elena, and the resort atmosphere is less intimate than Sarah's boutique preference.",
      compromises: [
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "Resort scale is less intimate than her boutique preference — may feel more like a hotel than a retreat",
        },
        {
          participantId: "anika-patel",
          participantName: "Anika Patel",
          compromise:
            "Vegan options listed as 'options' rather than dedicated vegan menu — may need advance coordination with kitchen",
        },
        {
          participantId: "elena-chen",
          participantName: "Elena Chen",
          compromise:
            "Historic property — wheelchair accessibility in a 19th-century building needs specific room confirmation",
        },
      ],
      unresolvable: [],
    },
    {
      venueId: "well-4",
      rank: 4,
      confidenceScore: 62,
      reasoning:
        "The Emerson Resort & Spa offers a solid boutique spa experience at the $$$ tier — more budget-friendly and relaxed. The meditation garden and nature walks suit Sarah's recovery needs. However, it falls below the members' $$$$ price floor, has limited programming variety, and the 'gluten-free adaptable' note for Anika suggests less confidence in handling complex dietary requirements.",
      compromises: [
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "Below her $$$$ price floor — may feel like a downgrade from the premium retreat experience expected",
        },
        {
          participantId: "tom-nakamura",
          participantName: "Tom Nakamura",
          compromise:
            "Minimal fitness facilities — yoga and nature walks only, no structured training",
        },
        {
          participantId: "anika-patel",
          participantName: "Anika Patel",
          compromise:
            "'Gluten-free adaptable' suggests limited dedicated GF options — risk for someone with strict requirements",
        },
      ],
      unresolvable: [
        "Below the members' $$$$ price floor — may not match the premium expectation for an Aurora-coordinated retreat",
      ],
    },
    {
      venueId: "well-5",
      rank: 5,
      confidenceScore: 42,
      reasoning:
        "The Lodge at Woodstock is a high-intensity fitness retreat (HIIT, CrossFit, cold plunge) — Tom's ideal venue. However, this directly contradicts Sarah's recovery needs: her Oura data shows critically low recovery (45) and high stress, making high-intensity programming potentially harmful. The performance nutrition focus may not align with Anika's vegan/gluten-free needs, and the lively atmosphere conflicts with the stated decompression vibe.",
      compromises: [
        {
          participantId: "sarah-chen",
          participantName: "Sarah Chen",
          compromise:
            "High-intensity programming is contraindicated by her wearable data — recoveryScore 45 means she needs rest, not HIIT",
        },
        {
          participantId: "anika-patel",
          participantName: "Anika Patel",
          compromise:
            "'Vegan adaptable' on a performance nutrition menu suggests limited plant-forward options — protein shakes instead of proper vegan cuisine",
        },
        {
          participantId: "elena-chen",
          participantName: "Elena Chen",
          compromise:
            "Fitness-focused programming is largely inaccessible for wheelchair users; spa-focused preference unmet",
        },
      ],
      unresolvable: [
        "Sarah's wearable data contraindicates high-intensity activity — this venue's core programming could worsen her recovery trajectory",
        "Lively/fitness atmosphere conflicts with the stated 'decompression' purpose of the retreat",
      ],
    },
  ],
  escalationRequired: true,
  escalationReason:
    "Sarah's Oura ring data shows critically elevated stress markers (sleep score 58, recovery score 45). The top recommendation (Miraval) should be booked with a recovery-focused program track for Sarah — specifically gentle yoga, sleep optimization, and no high-intensity activities. However, Tom has explicitly requested structured fitness programming. A Lifestyle Strategist should negotiate a split programming schedule: recovery track for Sarah and Elena, moderate fitness track for Tom, with Anika able to float between both. This customization requires direct coordination with Miraval's wellness concierge.",
  escalationContext:
    "Group of 4 (3 Aurora members + 1 guest) for a 3-day recovery retreat in Hudson Valley, April 25-27. Top recommendation: Miraval Hudson Valley (wellness resort with broad programming). Critical health flag: Sarah Chen's Oura data shows recovery score 45 and sleep score 58 — she needs recovery-focused programming, not general wellness. Programming split: Sarah needs gentle recovery, Tom wants fitness intensity — recommend split-track scheduling. Elena Chen (guest, wheelchair user) needs ground-floor room confirmation and accessible programming options. Anika Patel requires strict vegan + gluten-free meals — confirm with kitchen for all 3 days. Budget note: Elena at $$$ tier vs. 3 members at $$$$ — recommend member-subsidized booking or group rate negotiation.",
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
      const eventType = event?.type;
      const fallback = eventType === "travel" ? travelFallbackResult
        : eventType === "experience" ? experienceFallbackResult
        : eventType === "wellness" ? wellnessFallbackResult
        : fallbackResult;
      return NextResponse.json(fallback);
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
