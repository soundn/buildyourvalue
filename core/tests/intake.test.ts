import { describe, expect, it } from "vitest";
import { HELP_ME_CHOOSE, INTAKE_QUESTIONS, applyIntake, intakePreferences, intakeProgress, jobs, matchJobs, nextIntakeQuestion, normalizeIntakeAnswers, roles, sampleProfile } from "../src/index.js";

describe("guided intake", () => {
  it("asks at most seven questions in order and skips the interests question unless asked for help", () => {
    expect(INTAKE_QUESTIONS.length).toBe(8);
    expect(nextIntakeQuestion({})?.id).toBe("roles");
    expect(nextIntakeQuestion({ roles: ["accountant"] })?.id).toBe("remote");
    expect(nextIntakeQuestion({ roles: [HELP_ME_CHOOSE] })?.id).toBe("interests");
    expect(intakeProgress({ roles: ["accountant"] }).total).toBe(7);
    const full = { roles: ["accountant"], remote: ["any"], experience: ["1_3"], minSalary: ["200000"], dealBreakers: ["none"], mustHaves: ["none"], start: ["now"] };
    expect(nextIntakeQuestion(full)).toBeNull();
  });
  it("drops unknown option values and trims to the maximum picks", () => {
    const a = normalizeIntakeAnswers({ remote: ["mars"], roles: ["accountant", "data_analyst", "sales_executive", "product_designer"], bogus: ["x"] });
    expect(a.remote).toBeUndefined();
    expect(a.roles).toEqual(["accountant", "data_analyst", "sales_executive"]);
  });
  it("maps answers to structured preferences", () => {
    const prefs = intakePreferences({ roles: ["accountant", "Customer service rep"], remote: ["remote_abroad"], experience: ["3_5"], minSalary: ["200000"], dealBreakers: ["night_shifts", "none"], mustHaves: ["laptop"], start: ["after_nysc"] });
    expect(prefs.targetRoles).toEqual(["accountant", "customer_support"]);
    expect(prefs.workPreference).toBe("remote");
    expect(prefs.remoteAbroad).toBe(true);
    expect(prefs.minSalaryNgn).toBe(200000);
    expect(prefs.dealBreakers).toEqual(["night_shifts"]);
    expect(prefs.startWithinDays).toBeNull();
    expect(intakePreferences({ minSalary: ["usd"] }).wantsDollarPay).toBe(true);
  });
  it("writes the first role into the profile and the matcher honours the salary floor", () => {
    const prefs = intakePreferences({ roles: ["customer_support"], remote: ["any"], experience: ["1_3"], minSalary: ["800000"], dealBreakers: ["none"], mustHaves: ["none"], start: ["now"] });
    const profile = applyIntake(sampleProfile, prefs);
    expect(profile.targetRole).toBe("customer_support");
    const role = roles.find((r) => r.id === "customer_support")!;
    const now = new Date("2026-10-20T00:00:00Z");
    const before = matchJobs(sampleProfile, role, jobs, { now, limit: 50 });
    const after = matchJobs(profile, role, jobs, { now, limit: 50 });
    expect(after.length).toBeLessThan(before.length);
    expect(after.every((m) => m.job.salaryMax === undefined || m.job.salaryMax >= 800000)).toBe(true);
  });
});
