import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { z } from "zod";
import {
  roles,
  courses,
  sampleProfile,
  scoreProfile,
  matchJobs,
  buildLearningPath,
  improveProfile,
  totalExperienceYears,
  intakePreferences,
  intakeProgress,
  nextIntakeQuestion,
  normalizeIntakeAnswers,
  type Profile,
} from "@byv/core";
import { aiEnabled, improveWithClaude, applyAiImprovement, phraseIntakeQuestion } from "./ai.js";
import { decide, listReviewItems, publishableJobs, reportJob, reportsFor } from "./review.js";

const ProfileSchema = z.object({
  basics: z.object({ name: z.string(), email: z.string(), phone: z.string(), location: z.string(), summary: z.string() }),
  targetRole: z.string(),
  workPreference: z.enum(["onsite", "hybrid", "remote", "any"]),
  work: z.array(z.object({ company: z.string(), position: z.string(), startDate: z.string(), endDate: z.string().optional(), highlights: z.array(z.string()) })),
  education: z.array(z.object({ institution: z.string(), area: z.string(), studyType: z.string(), endDate: z.string().optional(), grade: z.string().optional() })),
  skills: z.array(z.string()),
  certifications: z.array(z.string()),
  nyscStatus: z.enum(["completed", "serving", "exempted", "not_yet", "na"]),
  preferences: z
    .object({
      targetRoles: z.array(z.string()),
      helpChoosing: z.boolean(),
      interests: z.array(z.string()),
      workPreference: z.enum(["onsite", "hybrid", "remote", "any"]),
      remoteAbroad: z.boolean(),
      experienceBand: z.enum(["none", "under_1", "1_3", "3_5", "5_plus"]),
      minSalaryNgn: z.number().nullable(),
      wantsDollarPay: z.boolean(),
      dealBreakers: z.array(z.string()),
      mustHaves: z.array(z.string()),
      startWithinDays: z.number().nullable(),
    })
    .optional(),
});

// Guided intake (BR-064): the answers so far, keyed by question id. Values are option values
// or short free text; anything unknown is dropped by normalizeIntakeAnswers in core.
const IntakeSchema = z.object({
  answers: z.record(z.string(), z.array(z.string().max(80)).max(6)).default({}),
});

const app = new Hono();
app.use(logger());
app.use(
  "*",
  cors({ origin: (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:3001").split(",").map((s) => s.trim()) }),
);

function roleOr404(id: string) {
  return roles.find((r) => r.id === id);
}

app.get("/health", (c) => c.json({ ok: true, ai: aiEnabled(), service: "byv-api", version: "0.1.0" }));

app.get("/v1/roles", (c) => c.json(roles));
app.get("/v1/courses", (c) => c.json(courses));
app.get("/v1/sample-profile", (c) => c.json(sampleProfile));

app.get("/v1/jobs", (c) => {
  const items = publishableJobs().map((job) => ({ ...job, reports: reportsFor(job.id).count }));
  return c.json({ count: items.length, items });
});

// Score + matches + learning path in one call: this is what the dashboard and the digest need.
app.post("/v1/evaluate", async (c) => {
  const parsed = ProfileSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "invalid_profile", issues: parsed.error.issues }, 400);
  const profile: Profile = parsed.data;
  const role = roleOr404(profile.targetRole);
  if (!role) return c.json({ error: "unknown_role" }, 400);

  const report = scoreProfile(profile, role);
  // Listings awaiting human review never reach users (BR-005): includeFlagged stays false.
  const matches = matchJobs(profile, role, publishableJobs(), { limit: 10, includeFlagged: false });
  const path = buildLearningPath(report, matches, role, courses);
  return c.json({ role, report, matches, path, years: totalExperienceYears(profile) });
});

app.post("/v1/cv/improve", async (c) => {
  const parsed = ProfileSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "invalid_profile", issues: parsed.error.issues }, 400);
  const profile: Profile = parsed.data;
  const role = roleOr404(profile.targetRole);
  if (!role) return c.json({ error: "unknown_role" }, 400);
  const years = totalExperienceYears(profile);

  if (aiEnabled()) {
    try {
      const ai = await improveWithClaude(profile, role);
      if (ai) {
        const improved = applyAiImprovement(profile, ai);
        return c.json({ engine: "claude", profile: improved, changes: ai.changes, before: scoreProfile(profile, role).total, after: scoreProfile(improved, role).total });
      }
    } catch (err) {
      console.error("claude improvement failed, falling back to rules:", err instanceof Error ? err.message : err);
    }
  }
  const { profile: improved, changes } = improveProfile(profile, role, years);
  return c.json({ engine: "rules", profile: improved, changes, before: scoreProfile(profile, role).total, after: scoreProfile(improved, role).total });
});

// One report suppresses a listing pending human review (ADR-0010). The MVP requires a session
// and uses the user id; the prototype takes an x-reporter-id header or falls back to the
// client address so the three-per-day cap has something to count against.
app.post("/v1/jobs/:id/report", async (c) => {
  const body = (await c.req.json().catch(() => ({}))) as { reason?: string };
  const reporterId =
    c.req.header("x-reporter-id") ?? c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const r = reportJob(c.req.param("id"), body.reason ?? "unspecified", reporterId);
  return c.json({ ok: true, accepted: r.accepted, reports: r.count });
});

// Admin surface. The MVP puts this behind staff authentication; the prototype keeps it open on localhost.
// Guided intake: returns the next of up to seven fixed questions for the answers so far,
// rephrased by Claude on the bulk model when a key is set (fixed copy otherwise), plus the
// structured preferences the answers map to. The model never changes options or ranks jobs.
app.post("/v1/intake/next", async (c) => {
  const parsed = IntakeSchema.safeParse(await c.req.json().catch(() => ({})));
  if (!parsed.success) return c.json({ error: "invalid_intake", issues: parsed.error.issues }, 400);
  const answers = normalizeIntakeAnswers(parsed.data.answers);
  const question = nextIntakeQuestion(answers);
  const progress = intakeProgress(answers);
  const preferences = intakePreferences(answers);
  if (!question) return c.json({ done: true, engine: "rules", question: null, progress, preferences });
  let engine: "claude" | "rules" = "rules";
  let phrased = { prompt: question.prompt, help: question.help ?? "" };
  if (aiEnabled() && Object.keys(answers).length > 0) {
    const ai = await phraseIntakeQuestion(question, answers);
    if (ai) {
      phrased = ai;
      engine = "claude";
    }
  }
  return c.json({ done: false, engine, question: { ...question, ...phrased }, progress, preferences });
});

app.get("/v1/admin/review", (c) => c.json(listReviewItems()));
app.post("/v1/admin/review/:id", async (c) => {
  const body = z.object({ decision: z.enum(["approved", "rejected"]), decidedBy: z.string().default("admin"), note: z.string().optional() }).safeParse(await c.req.json());
  if (!body.success) return c.json({ error: "invalid_decision" }, 400);
  const item = decide(c.req.param("id"), body.data.decision, body.data.decidedBy, body.data.note);
  if (!item) return c.json({ error: "not_found" }, 404);
  return c.json(item);
});

const port = Number(process.env.PORT ?? 4000);
serve({ fetch: app.fetch, port }, () => {
  console.log(`byv-api listening on http://localhost:${port} (ai: ${aiEnabled() ? "claude" : "rules"})`);
});

export default app;
