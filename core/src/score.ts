import type { Profile, Role, ScoreComponent, WeaknessReport } from "./types.js";
import { hasSkill, normalizeSkills } from "./skills.js";

// Six-component weakness score (docs/PLAN.md, "Score CV weakness on six components").
// Deterministic by design: no LLM call is needed to score, so the free tier costs nothing.

const WEIGHTS: Record<ScoreComponent["id"], number> = {
  keywords: 0.3,
  impact: 0.2,
  completeness: 0.15,
  experience_fit: 0.15,
  certifications: 0.1,
  format: 0.1,
};

const ACTION_VERBS = [
  "led", "built", "increased", "reduced", "delivered", "launched", "managed", "designed",
  "implemented", "improved", "grew", "resolved", "trained", "coordinated", "achieved",
  "negotiated", "closed", "automated", "analysed", "analyzed", "developed", "created",
  "reconciled", "processed", "handled", "supported", "drove", "won", "saved",
];
const WEAK_OPENERS = ["assisted", "helped", "responsible for", "worked on", "involved in", "duties included"];
const NUMBER_RE = /(\d+(\.\d+)?%|₦\s?\d|\bN\d|\$\d|\d{2,}|\b\d+\s?(users|clients|customers|tickets|staff|people|leads|accounts|students|orders|products))/i;

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function monthsBetween(start: string, end?: string): number {
  if (!start) return 0;
  const [sy, sm] = start.split("-").map(Number);
  const e = end && end.trim() ? end : new Date().toISOString().slice(0, 7);
  const [ey, em] = e.split("-").map(Number);
  if (!sy || !ey) return 0;
  return Math.max(0, (ey - sy) * 12 + ((em || 1) - (sm || 1)));
}

export function totalExperienceYears(profile: Profile): number {
  const months = profile.work.reduce((acc, w) => acc + monthsBetween(w.startDate, w.endDate), 0);
  return Math.round((months / 12) * 10) / 10;
}

export function scoreProfile(profile: Profile, role: Role): WeaknessReport {
  const cvSkills = normalizeSkills(profile.skills);
  const allText = [
    profile.basics.summary,
    ...profile.work.flatMap((w) => [w.position, ...w.highlights]),
  ].join(" ").toLowerCase();

  // 1. Keywords: core skills and ATS keywords for the target role.
  const coreHits = role.coreSkills.filter((s) => hasSkill(cvSkills, s) || allText.includes(s));
  const niceHits = role.niceToHave.filter((s) => hasSkill(cvSkills, s) || allText.includes(s));
  const kwHits = role.keywords.filter((k) => allText.includes(k));
  const missingCore = role.coreSkills.filter((s) => !coreHits.includes(s));
  const keywordScore = clamp(
    (coreHits.length / role.coreSkills.length) * 70 +
      (niceHits.length / Math.max(1, role.niceToHave.length)) * 15 +
      (kwHits.length / Math.max(1, role.keywords.length)) * 15,
  );

  // 2. Impact: quantified, action-led bullets.
  const bullets = profile.work.flatMap((w) => w.highlights).filter((b) => b.trim());
  const quantified = bullets.filter((b) => NUMBER_RE.test(b)).length;
  const actionLed = bullets.filter((b) => ACTION_VERBS.some((v) => b.trim().toLowerCase().startsWith(v))).length;
  const weak = bullets.filter((b) => WEAK_OPENERS.some((v) => b.trim().toLowerCase().startsWith(v))).length;
  const impactScore = bullets.length === 0
    ? 10
    : clamp((quantified / bullets.length) * 60 + (actionLed / bullets.length) * 40 - (weak / bullets.length) * 20);

  // 3. Completeness: sections present.
  const checks = [
    !!profile.basics.name,
    !!profile.basics.email && /@/.test(profile.basics.email),
    !!profile.basics.phone,
    !!profile.basics.location,
    profile.basics.summary.trim().length >= 60,
    profile.work.length > 0,
    profile.education.length > 0,
    profile.skills.length >= 5,
    profile.nyscStatus !== "not_yet" || true,
  ];
  const completenessScore = clamp((checks.filter(Boolean).length / checks.length) * 100);

  // 4. Experience fit: years versus what listings for the role typically want.
  const years = totalExperienceYears(profile);
  const typical = role.family === "Software engineering" || role.family === "Data" || role.family === "Security" ? 2 : 1;
  const experienceScore = clamp(years >= typical ? 100 : 40 + (years / typical) * 60);

  // 5. Certifications relevant to the role.
  const certs = normalizeSkills(profile.certifications);
  const relevantCerts = certs.filter((c) => role.niceToHave.some((n) => c.includes(n) || n.includes(c)) || role.coreSkills.some((n) => c.includes(n)));
  const certScore = clamp(certs.length === 0 ? 20 : relevantCerts.length > 0 ? 100 : 55);

  // 6. Format and ATS hygiene: length, bullet count, summary length, phone format.
  const totalBullets = bullets.length;
  const formatChecks = [
    totalBullets >= 3 && totalBullets <= 18,
    profile.basics.summary.length <= 500,
    bullets.every((b) => b.length <= 220),
    /^(\+234|0)\d{10}$/.test(profile.basics.phone.replace(/\s|-/g, "")) || profile.basics.phone === "",
    !/[|•●★]/.test(allText),
  ];
  const formatScore = clamp((formatChecks.filter(Boolean).length / formatChecks.length) * 100);

  const components: ScoreComponent[] = [
    {
      id: "keywords",
      label: "Role keywords",
      score: keywordScore,
      weight: WEIGHTS.keywords,
      finding: missingCore.length
        ? `Your CV does not show ${missingCore.length} of the ${role.coreSkills.length} core skills employers list for ${role.title}: ${missingCore.join(", ")}.`
        : `Your CV covers all ${role.coreSkills.length} core skills for ${role.title}.`,
      fix: missingCore.length
        ? "Add the skills you genuinely have to the skills section and show them in a work bullet. Learn the rest through the path below."
        : "Keep the skills section as it is and mirror the exact wording from each listing you apply to.",
      missingSkills: missingCore,
    },
    {
      id: "impact",
      label: "Measurable impact",
      score: impactScore,
      weight: WEIGHTS.impact,
      finding: bullets.length === 0
        ? "You have no work bullets yet, so recruiters cannot see what you achieved."
        : `${quantified} of ${bullets.length} bullets contain a number and ${weak} start with weak phrases like "assisted" or "responsible for".`,
      fix: "Start each bullet with an action verb and add a number: how many, how much, how fast, or how often.",
    },
    {
      id: "completeness",
      label: "Completeness",
      score: completenessScore,
      weight: WEIGHTS.completeness,
      finding: completenessScore === 100
        ? "Every expected section is present."
        : "At least one expected section is missing or too short (summary, contact details, education, or at least five skills).",
      fix: "Fill every section. Nigerian recruiters still expect a phone number, location and a short professional summary.",
    },
    {
      id: "experience_fit",
      label: "Experience fit",
      score: experienceScore,
      weight: WEIGHTS.experience_fit,
      finding: `You show ${years} year(s) of experience; most ${role.title} listings ask for at least ${typical}.`,
      fix: years < typical
        ? "Count internships, NYSC placements, volunteering and freelance work as experience, and list them with dates."
        : "You meet the typical bar. Make the most recent role the most detailed.",
    },
    {
      id: "certifications",
      label: "Certifications",
      score: certScore,
      weight: WEIGHTS.certifications,
      finding: certs.length === 0
        ? "No certifications listed."
        : relevantCerts.length
          ? `Relevant certification(s) found: ${relevantCerts.join(", ")}.`
          : "Certifications listed, but none are the ones employers for this role look for.",
      fix: `Free or aided options exist for ${role.title}; the learning path picks the ones that carry a verifiable certificate.`,
    },
    {
      id: "format",
      label: "Format and ATS hygiene",
      score: formatScore,
      weight: WEIGHTS.format,
      finding: formatScore === 100
        ? "Length, bullet count and contact format all pass."
        : "One or more hygiene checks failed: bullet count outside 3 to 18, overlong bullets or summary, unusual symbols, or a phone number not in Nigerian format.",
      fix: "Keep to one or two pages, 3 to 6 bullets per role, plain text, and a phone number like +234 801 234 5678.",
    },
  ];

  const total = clamp(components.reduce((acc, c) => acc + c.score * c.weight, 0));
  const band = total < 45 ? "weak" : total < 65 ? "developing" : total < 80 ? "competitive" : "strong";
  return { total, band, components, missingSkills: missingCore };
}
