import type { Profile, Role } from "./types.js";

// Deterministic CV improvements used when no LLM key is configured, and as the safety
// net when the model refuses or fails. Rules mirror the weakness score so a rewrite
// moves the score for understandable reasons.

const WEAK_TO_STRONG: [RegExp, string][] = [
  [/^responsible for\s+/i, "Managed "],
  [/^assisted (with|in)\s+/i, "Supported "],
  [/^helped (to\s+)?/i, "Supported "],
  [/^worked on\s+/i, "Delivered "],
  [/^involved in\s+/i, "Contributed to "],
  [/^duties included\s+/i, "Handled "],
  [/^in charge of\s+/i, "Led "],
];

export function strengthenBullet(bullet: string): string {
  let b = bullet.trim().replace(/\s+/g, " ");
  if (!b) return b;
  for (const [re, rep] of WEAK_TO_STRONG) {
    if (re.test(b)) {
      b = b.replace(re, rep);
      break;
    }
  }
  b = b.charAt(0).toUpperCase() + b.slice(1);
  if (!/[.!?]$/.test(b)) b += ".";
  if (!/\d/.test(b)) b = b.replace(/\.$/, " (add a number: how many, how much, or how often).");
  return b;
}

export function draftSummary(profile: Profile, role: Role, years: number): string {
  const topSkills = profile.skills.slice(0, 4).join(", ");
  const edu = profile.education[0];
  const eduText = edu ? `${edu.studyType} in ${edu.area} graduate` : "graduate";
  const expText = years >= 1 ? `with ${years} year${years === 1 ? "" : "s"} of experience` : "with hands-on project and internship experience";
  const nysc = profile.nyscStatus === "completed" ? " NYSC completed." : profile.nyscStatus === "exempted" ? " NYSC exempted." : "";
  return `${eduText} ${expText} seeking a ${role.title} role. Strengths in ${topSkills || role.coreSkills.slice(0, 3).join(", ")}. Known for measurable results, clear communication and fast learning.${nysc}`.trim();
}

export function improveProfile(profile: Profile, role: Role, years: number): { profile: Profile; changes: string[] } {
  const changes: string[] = [];
  const next: Profile = JSON.parse(JSON.stringify(profile));

  if (next.basics.summary.trim().length < 60) {
    next.basics.summary = draftSummary(profile, role, years);
    changes.push("Wrote a professional summary targeted at the role.");
  }

  let strengthened = 0;
  next.work = next.work.map((w) => ({
    ...w,
    highlights: w.highlights.filter((h) => h.trim()).map((h) => {
      const s = strengthenBullet(h);
      if (s !== h.trim()) strengthened++;
      return s;
    }),
  }));
  if (strengthened) changes.push(`Rewrote ${strengthened} bullet(s) to start with an action verb and prompt for a number.`);

  const lowerSkills = next.skills.map((s) => s.toLowerCase());
  const added: string[] = [];
  for (const core of role.coreSkills) {
    const inText = next.work.some((w) => w.highlights.join(" ").toLowerCase().includes(core)) || next.basics.summary.toLowerCase().includes(core);
    if (inText && !lowerSkills.includes(core)) {
      next.skills.push(core);
      added.push(core);
    }
  }
  if (added.length) changes.push(`Added skills already evidenced in your experience: ${added.join(", ")}.`);

  next.basics.phone = next.basics.phone.replace(/\s|-/g, "").replace(/^0(\d{10})$/, "+234$1");
  if (next.basics.phone !== profile.basics.phone) changes.push("Formatted the phone number in international format.");

  return { profile: next, changes };
}
