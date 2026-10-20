import { describe, it, expect } from "vitest";
import { matchJobs, screenJob, jobs, roles, sampleProfile, buildLearningPath, scoreProfile, courses } from "../src/index.js";

const role = roles.find((r) => r.id === "customer_support")!;
const now = new Date("2026-10-20T00:00:00Z");

describe("scam screen", () => {
  it("fails the fee-demanding impersonation listing", () => {
    const v = screenJob(jobs.find((j) => j.id === "s001")!);
    expect(v.status).toBe("fail");
    expect(v.flags.some((f) => f.includes("fee"))).toBe(true);
  });
  it("sends the webmail-only listing to review", () => {
    const v = screenJob(jobs.find((j) => j.id === "s004")!);
    expect(v.status).toBe("review");
  });
  it("passes a verified listing", () => {
    expect(screenJob(jobs.find((j) => j.id === "j001")!).status).toBe("pass");
  });
});

describe("matching", () => {
  it("never surfaces failed listings and drops stale ones", () => {
    const matches = matchJobs(sampleProfile, role, jobs, { now, limit: 50 });
    const ids = matches.map((m) => m.job.id);
    expect(ids).not.toContain("s001");
    expect(ids).not.toContain("s002");
    expect(ids).not.toContain("j024");
  });
  it("ranks the target-role Lagos listing near the top with reasons", () => {
    const matches = matchJobs(sampleProfile, role, jobs, { now });
    expect(matches[0].fit).toBeGreaterThanOrEqual(matches[matches.length - 1].fit);
    const top5 = matches.slice(0, 5).map((m) => m.job.id);
    expect(top5).toContain("j001");
    expect(matches.every((m) => m.scam.status !== "fail")).toBe(true);
    expect(matches[0].reasons.length).toBeGreaterThan(0);
  });
});

describe("learning path", () => {
  it("builds up to three steps, free courses first, with a projected lift", () => {
    const report = scoreProfile(sampleProfile, role);
    const matches = matchJobs(sampleProfile, role, jobs, { now });
    const path = buildLearningPath(report, matches, role, courses);
    expect(path.steps.length).toBeGreaterThan(0);
    expect(path.steps.length).toBeLessThanOrEqual(3);
    expect(path.steps[0].course.cost).toBe("free");
    expect(path.projectedFitLift).toBeGreaterThan(0);
  });
});
