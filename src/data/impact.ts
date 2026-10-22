/**
 * Impact figures, each traced to the source presentation it came from.
 *
 * Only figures that are consistent across the source decks (or appear in one
 * deck with an unambiguous definition) are shown. Revenue is deliberately NOT
 * displayed: the decks report three different figures ($6,600+, $10,396.36 and
 * "nearly $20,000") for different, unstated reporting periods, and combining
 * them would be misleading. Gross margin (57%) is tied to one of those revenue
 * figures and is omitted for the same reason.
 */
export type Stat = {
  id: string;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
  source: string;
};

export const STATS: Stat[] = [
  {
    id: "diverted",
    value: 1500,
    suffix: "+",
    label: "Cosmetic products diverted",
    detail: "Unwanted makeup redirected toward pigment recovery instead of the waste stream.",
    source: "Reported consistently in the ReShade Info Session and Enactus Humber pitch decks.",
  },
  {
    id: "produced",
    value: 500,
    suffix: "+",
    label: "Bottles & jars of paint produced",
    detail: "Prototype paints made from recovered cosmetic pigments.",
    source: "Enactus Humber pitch deck (reported as 500 jars and 500+ bottles).",
  },
  {
    id: "reached",
    value: 2000,
    suffix: "+",
    label: "People directly reached",
    detail: "Through awareness events, paint nights and community outreach.",
    source: "ReShade Info Session deck — “Impact So Far”.",
  },
  {
    id: "suppliers",
    value: 150,
    label: "Suppliers engaged in green business practices",
    detail: "Businesses engaged through ReShade’s supplier outreach. Engagement is not the same as a formal partnership.",
    source: "ReShade Info Session deck — “Impact So Far”.",
  },
  {
    id: "hours",
    value: 4800,
    suffix: "+",
    label: "Total volunteer hours",
    detail: "Contributed by student volunteers.",
    source: "Enactus Humber pitch deck.",
  },
  {
    id: "students",
    value: 51,
    label: "Active students",
    detail: "Student volunteers listed as active at the time of the pitch.",
    source: "Enactus Humber pitch deck.",
  },
];

export const statById = (id: string) => STATS.find((s) => s.id === id)!;
