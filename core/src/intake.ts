/**
 * Guided intake: up to seven tappable questions that turn "I don't really know" into the
 * structured preferences the matcher uses. Deterministic: the question order, the options
 * and the mapping to preferences live here and are tested. The API may ask Claude to
 * rephrase a prompt conversationally, but the model never adds options, never ranks jobs
 * and never decides what a user sees (BR-064).
 */
import type { Profile, IntakePreferences } from "./types.js";
import { roles } from "./data/index.js";

export type IntakeQuestionId = "roles" | "interests" | "remote" | "experience" | "minSalary" | "dealBreakers" | "mustHaves" | "start";

export type IntakeOption = { value: string; label: string };

export type IntakeQuestion = {
  id: IntakeQuestionId;
  prompt: string;
  help?: string;
  options: IntakeOption[];
  multi: boolean;
  max?: number; // most options a user may pick when multi
  allowFreeText: boolean;
};

/** Answers keyed by question id; each value is the list of option values (or free text) chosen. */
export type IntakeAnswers = Partial<Record<IntakeQuestionId, string[]>>;

export type { IntakePreferences };

export const HELP_ME_CHOOSE = "help_me_choose";

const families = [...new Set(roles.map((r) => r.family))];

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  {
    id: "roles",
    prompt: "What kind of work are you looking for?",
    help: "Pick up to three, or let us help you choose from your CV.",
    options: [...roles.map((r) => ({ value: r.id, label: r.title })), { value: HELP_ME_CHOOSE, label: "Help me choose" }],
    multi: true,
    max: 3,
    allowFreeText: true,
  },
  {
    id: "interests",
    prompt: "Which of these sounds most like you?",
    help: "We will suggest roles from your CV in these areas.",
    options: families.map((f) => ({ value: f, label: f })),
    multi: true,
    max: 2,
    allowFreeText: false,
  },
  {
    id: "remote",
    prompt: "Where will you work from?",
    help: "Remote jobs abroad are shown only when the employer hires in Nigeria.",
    options: [
      { value: "onsite", label: "On-site in my city" },
      { value: "hybrid", label: "Hybrid in my city" },
      { value: "remote_ng", label: "Remote, within Nigeria" },
      { value: "remote_abroad", label: "Remote, abroad too" },
      { value: "any", label: "Anything" },
    ],
    multi: false,
    allowFreeText: false,
  },
  {
    id: "experience",
    prompt: "How much experience do you have in that line of work?",
    help: "NYSC, internships and volunteering count.",
    options: [
      { value: "none", label: "None yet" },
      { value: "under_1", label: "Under a year" },
      { value: "1_3", label: "1 to 3 years" },
      { value: "3_5", label: "3 to 5 years" },
      { value: "5_plus", label: "Over 5 years" },
    ],
    multi: false,
    allowFreeText: false,
  },
  {
    id: "minSalary",
    prompt: "What is the least you would accept per month?",
    help: "We hide roles that state a salary below this.",
    options: [
      { value: "0", label: "No minimum" },
      { value: "100000", label: "₦100,000" },
      { value: "200000", label: "₦200,000" },
      { value: "400000", label: "₦400,000" },
      { value: "800000", label: "₦800,000" },
      { value: "usd", label: "Paid in dollars" },
    ],
    multi: false,
    allowFreeText: true,
  },
  {
    id: "dealBreakers",
    prompt: "Anything you will not do?",
    options: [
      { value: "sales", label: "Commission-only sales" },
      { value: "night_shifts", label: "Night shifts" },
      { value: "relocation", label: "Relocating" },
      { value: "unpaid_trial", label: "Unpaid trial periods" },
      { value: "field_work", label: "Field or door-to-door work" },
      { value: "none", label: "Nothing, show me everything" },
    ],
    multi: true,
    max: 4,
    allowFreeText: true,
  },
  {
    id: "mustHaves",
    prompt: "Anything you must have?",
    options: [
      { value: "health_insurance", label: "Health insurance" },
      { value: "laptop", label: "Laptop provided" },
      { value: "flexible_hours", label: "Flexible hours" },
      { value: "pension", label: "Pension" },
      { value: "training", label: "Paid training" },
      { value: "none", label: "No must-haves" },
    ],
    multi: true,
    max: 3,
    allowFreeText: true,
  },
  {
    id: "start",
    prompt: "How soon can you start?",
    options: [
      { value: "now", label: "Right away" },
      { value: "2_weeks", label: "In two weeks" },
      { value: "1_month", label: "In a month" },
      { value: "after_nysc", label: "After NYSC" },
    ],
    multi: false,
    allowFreeText: false,
  },
];

const byId = new Map(INTAKE_QUESTIONS.map((q) => [q.id, q]));

/** The question to ask next, or null when the intake is complete. "interests" is asked only after "Help me choose". */
export function nextIntakeQuestion(answers: IntakeAnswers): IntakeQuestion | null {
  for (const q of INTAKE_QUESTIONS) {
    if (q.id === "interests" && !(answers.roles ?? []).includes(HELP_ME_CHOOSE)) continue;
    const a = answers[q.id];
    if (!a || a.length === 0) return q;
  }
  return null;
}

export function intakeProgress(answers: IntakeAnswers): { answered: number; total: number } {
  const total = INTAKE_QUESTIONS.length - ((answers.roles ?? []).includes(HELP_ME_CHOOSE) ? 0 : 1);
  const answered = INTAKE_QUESTIONS.filter((q) => (q.id !== "interests" || (answers.roles ?? []).includes(HELP_ME_CHOOSE)) && (answers[q.id]?.length ?? 0) > 0).length;
  return { answered, total };
}

/** Rejects unknown option values on questions without free text and trims to the question's max. */
export function normalizeIntakeAnswers(raw: Record<string, string[]>): IntakeAnswers {
  const out: IntakeAnswers = {};
  for (const [id, values] of Object.entries(raw)) {
    const q = byId.get(id as IntakeQuestionId);
    if (!q || !Array.isArray(values)) continue;
    const known = new Set(q.options.map((o) => o.value));
    let vals = values.map((v) => String(v).trim().slice(0, 80)).filter(Boolean);
    if (!q.allowFreeText) vals = vals.filter((v) => known.has(v));
    if (!q.multi) vals = vals.slice(0, 1);
    else if (q.max) vals = vals.slice(0, q.max);
    if (vals.length) out[q.id] = vals;
  }
  return out;
}

const roleIds = new Set(roles.map((r) => r.id));

export function intakePreferences(answers: IntakeAnswers): IntakePreferences {
  const roleAnswers = answers.roles ?? [];
  const helpChoosing = roleAnswers.includes(HELP_ME_CHOOSE);
  const targetRoles = roleAnswers.filter((r) => roleIds.has(r));
  // Free-text role names are matched to a known role by title words.
  for (const free of roleAnswers.filter((r) => !roleIds.has(r) && r !== HELP_ME_CHOOSE)) {
    const hit = roles.find((r) => free.toLowerCase().includes(r.title.toLowerCase().split(" ")[0]));
    if (hit && !targetRoles.includes(hit.id)) targetRoles.push(hit.id);
  }
  const remote = answers.remote?.[0] ?? "any";
  const workPreference: Profile["workPreference"] =
    remote === "onsite" ? "onsite" : remote === "hybrid" ? "hybrid" : remote.startsWith("remote") ? "remote" : "any";
  const salaryRaw = answers.minSalary?.[0] ?? "0";
  const wantsDollarPay = salaryRaw === "usd";
  const salaryNumber = Number(salaryRaw.replace(/[^\d]/g, ""));
  const minSalaryNgn = wantsDollarPay || !salaryNumber ? null : salaryNumber;
  const start = answers.start?.[0] ?? "now";
  const startWithinDays = start === "now" ? 0 : start === "2_weeks" ? 14 : start === "1_month" ? 30 : null;
  const clean = (xs?: string[]) => (xs ?? []).filter((x) => x !== "none");
  return {
    targetRoles,
    helpChoosing,
    interests: answers.interests ?? [],
    workPreference,
    remoteAbroad: remote === "remote_abroad",
    experienceBand: (answers.experience?.[0] as IntakePreferences["experienceBand"]) ?? "none",
    minSalaryNgn,
    wantsDollarPay,
    dealBreakers: clean(answers.dealBreakers),
    mustHaves: clean(answers.mustHaves),
    startWithinDays,
  };
}

/** Writes the preferences into a profile. The first target role becomes the role the CV is scored against. */
export function applyIntake(profile: Profile, prefs: IntakePreferences): Profile {
  const next: Profile = JSON.parse(JSON.stringify(profile));
  if (prefs.targetRoles[0]) next.targetRole = prefs.targetRoles[0];
  next.workPreference = prefs.workPreference;
  next.preferences = prefs;
  return next;
}
