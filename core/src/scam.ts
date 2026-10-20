import type { Job, ScamVerdict } from "./types.js";

// Rules-based scam screen (docs/BRD.md, BR-003 and BRL-004..006). Deterministic and
// explainable: every flag is a sentence a user or an admin reviewer can act on.

const FEE_RE = /(registration|processing|training|application|medical|uniform|form)\s+fee|pay\s+(?:₦|n)?\s?\d|\b(?:₦|n)\s?\d{1,3}(,\d{3})+\b.*(before|to secure|to confirm)|non[- ]?refundable|bank\s+transfer\s+to/i;
const WEBMAIL_RE = /@(gmail|yahoo|hotmail|outlook|aol|protonmail|icloud)\./i;
const WHATSAPP_ONLY_RE = /apply\s+via\s+whatsapp|whatsapp\s+only|dm\s+on\s+whatsapp|chat\s+us\s+on\s+whatsapp|send\s+cv\s+to\s+(\+?234|0)\d{9,10}/i;
const TOO_GOOD_RE = /no\s+experience\s+(needed|required)|anyone\s+can\s+apply|earn\s+(up\s+to\s+)?(₦|n)\s?\d{3},\d{3}\s*(daily|per\s+day|weekly)/i;
const URGENCY_RE = /urgent(ly)?\s+hiring|immediate\s+employment|slots?\s+(are\s+)?limited|first\s+\d+\s+applicants/i;
const IMPERSONATION_RE = /(dangote|nnpc|shell|chevron|mtn|unilever|nestle|nigerian\s+immigration|customs|central\s+bank|cbn)\b/i;

export function screenJob(job: Job): ScamVerdict {
  const flags: string[] = [];
  const text = `${job.title} ${job.description}`;

  if (FEE_RE.test(text)) flags.push("Asks candidates to pay a fee. No legitimate employer charges to apply.");
  if (!job.companyDomain) flags.push("No company website or corporate domain on record.");
  if (job.contactEmail && WEBMAIL_RE.test(job.contactEmail)) flags.push(`Contact uses a free webmail address (${job.contactEmail}).`);
  if (job.companyDomain && job.contactEmail && !job.contactEmail.toLowerCase().endsWith(`@${job.companyDomain.toLowerCase()}`)) {
    flags.push("Contact email domain does not match the company domain.");
  }
  if (WHATSAPP_ONLY_RE.test(text)) flags.push("Application is by WhatsApp or phone number only.");
  if (TOO_GOOD_RE.test(text)) flags.push("Promises high pay with no experience required.");
  if (URGENCY_RE.test(text)) flags.push("Uses pressure language about limited slots or urgency.");
  if (IMPERSONATION_RE.test(job.company) && !job.companyDomain) flags.push("Uses a well-known company name without a verifiable domain (possible impersonation).");
  if (job.salaryMin && job.experienceYears === 0 && job.salaryMin >= 600000) flags.push("Entry-level salary is implausibly high for the Nigerian market.");

  const hardFail = flags.some((f) => f.startsWith("Asks candidates to pay") || f.startsWith("Uses a well-known company"));
  // One or two soft flags go to human review; three or more is a fail without review.
  const status: ScamVerdict["status"] = hardFail || flags.length >= 3 ? "fail" : flags.length >= 1 ? "review" : "pass";
  return { status, flags };
}

export function isFresh(job: Job, maxAgeDays: number, now = new Date()): boolean {
  const posted = new Date(job.postedAt + "T00:00:00Z").getTime();
  return (now.getTime() - posted) / 86_400_000 <= maxAgeDays;
}
