/**
 * Listing attributes read from the title and description, for the guided-intake deal-breakers
 * and must-haves (BR-064). Rules only: a listing that states a thing gets the flag; silence is
 * not evidence either way, which is why must-haves boost rather than exclude.
 */
import type { Job } from "./types.js";

export type DealBreakerId = "sales" | "night_shifts" | "relocation" | "unpaid_trial" | "field_work";
export type MustHaveId = "health_insurance" | "laptop" | "flexible_hours" | "pension" | "training";

export const DEAL_BREAKER_LABELS: Record<DealBreakerId, string> = {
  sales: "commission-only pay",
  night_shifts: "night shifts",
  relocation: "relocation",
  unpaid_trial: "an unpaid trial period",
  field_work: "field or door-to-door work",
};

export const MUST_HAVE_LABELS: Record<MustHaveId, string> = {
  health_insurance: "health insurance",
  laptop: "a laptop provided",
  flexible_hours: "flexible hours",
  pension: "a pension",
  training: "paid training",
};

const DEAL_BREAKERS: Record<DealBreakerId, RegExp> = {
  sales: /\b(commission[- ]only|100% commission|commission[- ]based (?:pay|only|role)|no (?:base|basic) (?:pay|salary)|pay(?:ment)? (?:is )?(?:purely |strictly )?(?:on|by) commission)\b/i,
  night_shifts: /\b(night shifts?|overnight shifts?|shift work including nights|rotating shifts? (?:including|with) nights?|24\/7 (?:rota|roster|shift)|graveyard shift)\b/i,
  relocation: /\b(must (?:be willing to )?relocate|willing(?:ness)? to relocate|relocation (?:is )?required|relocate to)\b/i,
  unpaid_trial: /\b(unpaid (?:trial|probation|internship|training)|trial period (?:is )?unpaid|no pay during (?:training|probation|trial)|first \d+ (?:weeks?|months?) (?:is |are )?unpaid)\b/i,
  field_work: /\b(door[- ]to[- ]door|field sales|field (?:work|role|based)|on the road|territory sales|canvass(?:ing)?|street marketing)\b/i,
};

const MUST_HAVES: Record<MustHaveId, RegExp> = {
  health_insurance: /\b(hmo|health insurance|medical (?:cover|insurance|aid)|health ?care (?:plan|cover))\b/i,
  laptop: /\b((?:laptop|work ?station|equipment|device) (?:provided|supplied|included|allowance)|we (?:provide|supply) (?:a |the )?(?:laptop|equipment|device)|company laptop|laptop and internet)\b/i,
  flexible_hours: /\b(flexible (?:hours|working|schedule|time)|flexi[- ]?time|set your own hours|asynchronous|work when you (?:want|choose))\b/i,
  pension: /\b(pension|retirement (?:plan|savings|contribution)s?|rsa contribution)\b/i,
  training: /\b(paid training|training (?:provided|included|allowance|budget)|learning (?:budget|allowance|stipend)|we (?:train|will train) you|sponsored certifications?)\b/i,
};

export type ListingAttributes = { dealBreakers: DealBreakerId[]; mustHaves: MustHaveId[] };

export function listingAttributes(job: Pick<Job, "title" | "description">): ListingAttributes {
  const text = `${job.title}\n${job.description}`;
  return {
    dealBreakers: (Object.keys(DEAL_BREAKERS) as DealBreakerId[]).filter((k) => DEAL_BREAKERS[k].test(text)),
    mustHaves: (Object.keys(MUST_HAVES) as MustHaveId[]).filter((k) => MUST_HAVES[k].test(text)),
  };
}
