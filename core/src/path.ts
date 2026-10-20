import type { Course, LearningPath, Match, Role, WeaknessReport } from "./types.js";
import { normalizeSkill } from "./skills.js";
import { aggregateGaps } from "./match.js";

// Learning path: the three skills that would most lift fit, each mapped to one course,
// free sources first (BRL-012). Projected lift is a simple, honest estimate: each core
// skill closed adds its share of the keyword component weight to the total.

const COST_RANK: Record<Course["cost"], number> = { free: 0, free_with_aid: 1, paid: 2 };

export function buildLearningPath(report: WeaknessReport, matches: Match[], role: Role, courses: Course[]): LearningPath {
  const prioritised: string[] = [];
  for (const s of report.missingSkills) prioritised.push(normalizeSkill(s));
  for (const g of aggregateGaps(matches)) {
    const s = normalizeSkill(g.skill);
    if (!prioritised.includes(s)) prioritised.push(s);
  }
  for (const s of role.niceToHave) {
    const n = normalizeSkill(s);
    if (!prioritised.includes(n)) prioritised.push(n);
  }

  const roleVocab = new Set([...role.coreSkills, ...role.niceToHave].map(normalizeSkill));
  const relevance = (c: Course) => c.skills.filter((s) => roleVocab.has(normalizeSkill(s))).length;

  const steps: LearningPath["steps"] = [];
  const used = new Set<string>();
  for (const skill of prioritised) {
    if (steps.length >= 3) break;
    const candidates = courses
      .filter((c) => !used.has(c.id) && c.skills.map(normalizeSkill).some((cs) => cs === skill || cs.includes(skill) || skill.includes(cs)))
      .sort((a, b) => COST_RANK[a.cost] - COST_RANK[b.cost] || relevance(b) - relevance(a) || Number(b.certificate) - Number(a.certificate) || a.hours - b.hours);
    const course = candidates[0];
    if (!course) continue;
    used.add(course.id);
    const isCore = report.missingSkills.map(normalizeSkill).includes(skill);
    steps.push({
      step: steps.length + 1,
      skill,
      course,
      why: isCore
        ? `${skill} is a core skill for ${role.title} and is missing from your CV.`
        : `${skill} appears in listings you matched with but is not on your CV.`,
    });
  }

  const coreClosed = steps.filter((s) => report.missingSkills.map(normalizeSkill).includes(s.skill)).length;
  const perCore = role.coreSkills.length ? (70 / role.coreSkills.length) * 0.3 : 0; // keyword component share
  const projectedFitLift = Math.round(coreClosed * perCore + (steps.length - coreClosed) * 3);

  return {
    targetRole: role.title,
    steps,
    estimatedHours: steps.reduce((acc, s) => acc + s.course.hours, 0),
    projectedFitLift,
  };
}
