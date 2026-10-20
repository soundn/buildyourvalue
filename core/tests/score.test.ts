import { describe, it, expect } from "vitest";
import { scoreProfile, roles, sampleProfile, improveProfile, totalExperienceYears } from "../src/index.js";

const role = roles.find((r) => r.id === "customer_support")!;

describe("weakness score", () => {
  it("scores the sample profile as weak or developing with six components", () => {
    const report = scoreProfile(sampleProfile, role);
    expect(report.components).toHaveLength(6);
    expect(report.total).toBeGreaterThan(0);
    expect(report.total).toBeLessThan(65);
    expect(["weak", "developing"]).toContain(report.band);
    const weights = report.components.reduce((a, c) => a + c.weight, 0);
    expect(weights).toBeCloseTo(1, 5);
  });

  it("flags missing core skills for the target role", () => {
    const report = scoreProfile(sampleProfile, role);
    expect(report.missingSkills).toContain("crm");
  });

  it("improves after the deterministic rewrite", () => {
    const before = scoreProfile(sampleProfile, role).total;
    const years = totalExperienceYears(sampleProfile);
    const { profile, changes } = improveProfile(sampleProfile, role, years);
    const after = scoreProfile(profile, role).total;
    expect(changes.length).toBeGreaterThan(0);
    expect(after).toBeGreaterThan(before);
    expect(profile.basics.phone).toBe("+2348031234567");
  });
});
