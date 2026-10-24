/**
 * Remote-eligibility classifier: can someone living in Nigeria apply to this remote listing?
 *
 * Deterministic and explainable. Structured fields (an explicit country list, a location
 * label such as "Remote, United States" or "Home based - EMEA", a timezone list) decide first;
 * the free text can only tighten an "open" or resolve an "unclear". Nigeria is UTC+1 (WAT).
 */

export type RemoteListingInput = {
  title: string;
  description: string; // plain text or HTML; tags are stripped
  locationLabel?: string; // "Worldwide", "Remote, United States", "Home based - EMEA; Office Based - London, UK"
  allowedCountries?: string[]; // explicit list, e.g. from Himalayas
  allowedTimezones?: number[]; // UTC offsets in hours, e.g. [-8, -7, ..., 1]
  isRemote?: boolean;
};

export type RemoteVerdict = "open" | "restricted" | "unclear";
export type RemoteBasis = "country-list" | "location-label" | "text" | "none";

export type RemoteEligibility = {
  verdict: RemoteVerdict;
  basis: RemoteBasis;
  reasons: string[];
};

export const NIGERIA_UTC_OFFSET = 1;

const OPEN_LABEL = /\b(worldwide|world ?wide|global(?:ly)?|anywhere|international|emea|africa|nigeria|lagos|abuja|all countries|any country|any location)\b/i;
const REMOTE_ONLY_LABEL = /^\s*(fully\s+)?remote(\s*\(?\s*(fully|100%)\s*\)?)?\s*$/i;

// Country and region names that, when they are the whole restriction, exclude Nigeria.
const RESTRICTED_LABEL = /\b(usa?|u\.s\.a?\.?|united states|america|americas|amer|north america|latam|latin america|canada|uk|u\.k\.|united kingdom|britain|england|eu|europe|european|apac|asia|asia[- ]pacific|australia|new zealand|india|germany|france|spain|portugal|italy|netherlands|ireland|poland|sweden|norway|denmark|finland|switzerland|austria|belgium|greece|japan|singapore|philippines|mexico|brazil|argentina|colombia|chile|peru|israel|uae|united arab emirates|south africa|kenya|egypt|turkey|ukraine|romania|czech|hungary|est|pst|cst|mst|cet|gmt|[a-z]+ time ?zones?)\b/i;

const STRONG_NEGATIVE: Array<[RegExp, string]> = [
  [/\b(authori[sz]ed|eligible|legally (?:able|permitted|allowed)|right|permit(?:ted)?) to work in (?:the )?(u\.?s\.?a?\.?|united states|uk|u\.k\.|united kingdom|eu|europe|canada|australia|germany|ireland|netherlands|france|spain|poland|india|brazil|mexico|philippines)\b/i, "requires the right to work in a named country"],
  [/\bmust (?:be |currently )?(?:based|located|reside|residing|live|living) in (?:the )?(u\.?s\.?a?\.?|united states|uk|u\.k\.|united kingdom|eu|europe|canada|australia|germany|ireland|netherlands|france|spain|poland|india|brazil|mexico|philippines|latam|latin america|americas|apac)\b/i, "must reside in a named country or region"],
  [/\b(u\.?s\.?a?\.?|united states|uk|u\.k\.|eu|canada|australia)[- ]based (?:only|candidates?|applicants?|employees?|contractors?|residents?)\b/i, "country-based candidates only"],
  [/\b(?:open (?:only )?to|only (?:open to|for|accepting))\s+(?:candidates|applicants|residents|citizens)\s+(?:in|from|of)\s+(?:the )?(u\.?s\.?a?\.?|united states|uk|united kingdom|eu|europe|canada|australia|latam|apac|india)\b/i, "open only to candidates in a named country or region"],
  [/\b(?:u\.?s\.?|united states|uk|canadian|eu)\s+(?:citizens?|citizenship|permanent residents?|green card)\b/i, "citizenship or permanent residency required"],
  [/\b(?:u\.?s\.?|united states)\s+work authori[sz]ation\b/i, "US work authorisation required"],
  [/\bw-?2\b/i, "W-2 employment (US payroll)"],
  [/\b(?:within|inside|in) (?:the )?(?:us|u\.s\.|united states|north american?|canadian|uk|european|eu|cet|est|pst|pacific|eastern|central)\s+(?:time ?zones?|business hours|working hours)\b/i, "must work in a named time zone"],
  [/\b(?:overlap|overlapping)\b[^.]{0,60}\b(?:pacific|pst|pdt|mountain|central|cst|eastern|est|edt|us|u\.s\.)\b[^.]{0,30}\b(?:hours|time)\b/i, "overlap with US working hours required"],
  [/\bresidents? of (?:the )?(u\.?s\.?a?\.?|united states|uk|united kingdom|eu|canada|australia)\b/i, "residents of a named country only"],
];

const POSITIVE: Array<[RegExp, string]> = [
  [/\bwork from anywhere\b/i, "says work from anywhere"],
  [/\banywhere in the world\b/i, "says anywhere in the world"],
  [/\b(?:fully|100%|truly) (?:remote|distributed)\b[^.]{0,40}\b(?:worldwide|globally|global|anywhere)\b/i, "fully remote, global"],
  [/\b(?:hire|hiring|recruit|team members?|employees?|colleagues?) (?:in|from|across) (?:over |more than )?\d{2,3}\+? countries\b/i, "hires across many countries"],
  [/\bopen to (?:candidates|applicants|anyone|talent) (?:globally|worldwide|anywhere|from any country|in any country|from all countries)\b/i, "open to candidates globally"],
  [/\b(?:global|worldwide|international) (?:candidates|applicants|talent|team)\b/i, "mentions global candidates"],
  [/\b(?:emea|africa|african|nigeria|nigerian|lagos|west africa)\b/i, "mentions Africa, EMEA or Nigeria"],
  [/\b(?:independent )?contractor(?:s| basis| agreement)?\b[^.]{0,60}\b(?:any|your) country\b/i, "contractor from any country"],
];

export function stripHtml(html: string): string {
  return html
    .replace(/<\s*(br|p|div|li|h\d|tr)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n+/g, "\n")
    .trim();
}

function classifyLabel(label: string): { verdict: RemoteVerdict; reason: string } {
  const parts = label.split(/[;|/]|\band\b|\bor\b/i).map((p) => p.trim()).filter(Boolean);
  // Any part that is explicitly open (Worldwide, EMEA, Africa) makes the listing open.
  for (const p of parts) if (OPEN_LABEL.test(p)) return { verdict: "open", reason: `location label "${p}" includes Nigeria` };
  const restrictedParts = parts.filter((p) => RESTRICTED_LABEL.test(p));
  if (restrictedParts.length > 0 && restrictedParts.length === parts.length) {
    return { verdict: "restricted", reason: `location label "${label}" names regions that exclude Nigeria` };
  }
  if (restrictedParts.length > 0) return { verdict: "restricted", reason: `location label "${label}" is limited to named countries` };
  if (REMOTE_ONLY_LABEL.test(label)) return { verdict: "unclear", reason: `location label "${label}" does not say where` };
  if (/\+\s*\d+\s+other countries/i.test(label)) return { verdict: "unclear", reason: `location label "${label}" lists countries we cannot see` };
  // A city or an unknown word: treat as a specific place, so restricted, unless it is remote.
  return { verdict: "unclear", reason: `location label "${label}" is not recognised` };
}

export function classifyRemoteEligibility(input: RemoteListingInput): RemoteEligibility {
  const reasons: string[] = [];
  const text = stripHtml(`${input.title}\n${input.description}`);
  const negatives = STRONG_NEGATIVE.filter(([re]) => re.test(text)).map(([, why]) => why);
  const positives = POSITIVE.filter(([re]) => re.test(text)).map(([, why]) => why);

  // 1. Explicit country list is the strongest signal.
  if (input.allowedCountries && input.allowedCountries.length > 0) {
    const list = input.allowedCountries.map((c) => c.toLowerCase());
    const includesNigeria = list.some((c) => /nigeria|worldwide|anywhere|global|africa\b/.test(c));
    if (!includesNigeria) {
      reasons.push(`country list (${input.allowedCountries.slice(0, 4).join(", ")}${input.allowedCountries.length > 4 ? ", ..." : ""}) excludes Nigeria`);
      return { verdict: "restricted", basis: "country-list", reasons };
    }
    reasons.push("country list includes Nigeria");
    if (input.allowedTimezones && input.allowedTimezones.length > 0 && !input.allowedTimezones.includes(NIGERIA_UTC_OFFSET)) {
      reasons.push("timezone list excludes UTC+1");
      return { verdict: "restricted", basis: "country-list", reasons };
    }
    if (negatives.length) {
      reasons.push(`but the text ${negatives[0]}`);
      return { verdict: "restricted", basis: "text", reasons };
    }
    return { verdict: "open", basis: "country-list", reasons };
  }

  // 2. Location label.
  let labelVerdict: RemoteVerdict | undefined;
  if (input.locationLabel && input.locationLabel.trim()) {
    const r = classifyLabel(input.locationLabel);
    labelVerdict = r.verdict;
    reasons.push(r.reason);
    if (r.verdict === "restricted") return { verdict: "restricted", basis: "location-label", reasons };
    if (r.verdict === "open") {
      if (negatives.length) {
        reasons.push(`but the text ${negatives[0]}`);
        return { verdict: "restricted", basis: "text", reasons };
      }
      return { verdict: "open", basis: "location-label", reasons };
    }
  }

  // 3. Timezone list alone.
  if (input.allowedTimezones && input.allowedTimezones.length > 0 && !input.allowedTimezones.includes(NIGERIA_UTC_OFFSET)) {
    reasons.push("timezone list excludes UTC+1");
    return { verdict: "restricted", basis: "country-list", reasons };
  }

  // 4. Free text.
  if (negatives.length) {
    reasons.push(`text ${negatives[0]}`);
    return { verdict: "restricted", basis: "text", reasons };
  }
  if (positives.length) {
    reasons.push(`text ${positives[0]}`);
    return { verdict: "open", basis: "text", reasons };
  }
  if (input.isRemote === false) {
    reasons.push("not marked remote");
    return { verdict: "restricted", basis: "location-label", reasons };
  }
  reasons.push(labelVerdict ? "text does not say who may apply" : "no location information and the text does not say who may apply");
  return { verdict: "unclear", basis: input.locationLabel ? "location-label" : "none", reasons };
}
