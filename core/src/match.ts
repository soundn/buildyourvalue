import type { Job, Match, Profile, Role } from "./types.js";
import { hasSkill, normalizeSkills } from "./skills.js";
import { screenJob, isFresh } from "./scam.js";
import { totalExperienceYears } from "./score.js";

// Two-stage matching in production is embedding recall then LLM rerank (PLAN.md,
// Architecture). The prototype keeps stage one deterministic and explainable so the
// loop can be demonstrated offline; the rerank hook is where an LLM slots in later.

export type MatchOptions = {
  maxAgeDays?: number; // default 30
  includeFlagged?: boolean; // show "review" listings with a warning (never "fail")
  limit?: number;
  now?: Date;
};

export function matchJobs(profile: Profile, role: Role, jobs: Job[], opts: MatchOptions = {}): Match[] {
  const { maxAgeDays = 30, includeFlagged = true, limit = 10, now = new Date() } = opts;
  const cvSkills = normalizeSkills(profile.skills);
  const years = totalExperienceYears(profile);
  const loc = profile.basics.location.toLowerCase();

  const out: Match[] = [];
  for (const job of jobs) {
    if (!isFresh(job, maxAgeDays, now)) continue;
    const scam = screenJob(job);
    if (scam.status === "fail") continue;
    if (scam.status === "review" && !includeFlagged) continue;
    // Guided-intake salary floor: a listing that states a maximum below the floor is not shown (BR-064).
    const floor = profile.preferences?.minSalaryNgn;
    if (floor && job.salaryMax !== undefined && job.salaryMax < floor) continue;

    const wanted = normalizeSkills(job.skills);
    const have = wanted.filter((s) => hasSkill(cvSkills, s));
    const gaps = wanted.filter((s) => !have.includes(s));
    const skillCoverage = wanted.length ? have.length / wanted.length : 0.5;

    const roleAligned = job.roleIds.includes(role.id);
    const expOk = years >= job.experienceYears;
    const expPartial = !expOk && years >= job.experienceYears - 1;

    const prefersRemote = profile.workPreference === "remote";
    const workTypeOk =
      profile.workPreference === "any" ||
      profile.workPreference === job.workType ||
      (profile.workPreference === "hybrid" && job.workType !== "onsite") ||
      (prefersRemote && job.workType === "remote");
    const sameCity = job.workType === "remote" || (loc && job.location.toLowerCase().includes(loc.split(",")[0].trim()));

    let fit = skillCoverage * 55 + (roleAligned ? 20 : 0) + (expOk ? 15 : expPartial ? 7 : 0) + (workTypeOk ? 5 : 0) + (sameCity ? 5 : 0);
    if (scam.status === "review") fit -= 10;
    fit = Math.max(0, Math.min(100, Math.round(fit)));

    const reasons: string[] = [];
    if (have.length) reasons.push(`You already have ${have.length} of the ${wanted.length} skills listed: ${have.slice(0, 4).join(", ")}.`);
    if (roleAligned) reasons.push(`This is a ${role.title} role, your target.`);
    if (expOk) reasons.push(`You meet the ${job.experienceYears}+ year experience requirement.`);
    else if (expPartial) reasons.push(`You are within a year of the ${job.experienceYears}-year requirement; apply if the rest fits.`);
    if (job.workType === "remote") reasons.push("Remote role, so location is not a barrier.");
    else if (sameCity) reasons.push(`Located in ${job.location}, near you.`);
    if (!reasons.length) reasons.push("Partial match on the role family; review the listing before applying.");

    out.push({ job, fit, reasons, gaps, scam });
  }

  return out.sort((a, b) => b.fit - a.fit || a.job.postedAt.localeCompare(b.job.postedAt)).slice(0, limit);
}

/** Aggregate skill gaps across the top matches, most frequent first. */
export function aggregateGaps(matches: Match[]): { skill: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const m of matches) for (const g of m.gaps) counts.set(g, (counts.get(g) ?? 0) + 1);
  return [...counts.entries()].map(([skill, count]) => ({ skill, count })).sort((a, b) => b.count - a.count);
}
