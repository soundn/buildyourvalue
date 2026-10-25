import { describe, expect, it } from "vitest";
import { classifyRemoteEligibility, jobEligibility, stripHtml } from "../src/remote.js";
import { jobs, matchJobs, roles, sampleProfile } from "../src/index.js";

const d = "We are a remote team. Apply with your CV.";

describe("classifyRemoteEligibility", () => {
  it("explicit country list without Nigeria is restricted", () => {
    const r = classifyRemoteEligibility({ title: "Support Specialist", description: d, allowedCountries: ["United States", "Canada"] });
    expect(r.verdict).toBe("restricted");
    expect(r.basis).toBe("country-list");
  });
  it("explicit country list with Nigeria is open", () => {
    const r = classifyRemoteEligibility({ title: "Designer", description: d, allowedCountries: ["Algeria", "Nigeria", "Kenya"], allowedTimezones: [-2, -1, 0, 1, 2] });
    expect(r.verdict).toBe("open");
  });
  it("country list with Nigeria but a timezone list without UTC+1 is restricted", () => {
    const r = classifyRemoteEligibility({ title: "Designer", description: d, allowedCountries: ["Nigeria", "United States"], allowedTimezones: [-8, -7, -6, -5] });
    expect(r.verdict).toBe("restricted");
    expect(r.reasons.join(" ")).toMatch(/timezone/);
  });
  it("Worldwide label is open", () => {
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "Worldwide" }).verdict).toBe("open");
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "Home based - Worldwide" }).verdict).toBe("open");
  });
  it("EMEA or a mixed label containing EMEA is open", () => {
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "Home Based - Americas; Home based - EMEA" }).verdict).toBe("open");
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "Remote, EMEA" }).verdict).toBe("open");
  });
  it("country-qualified remote labels are restricted", () => {
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "Remote, United States" }).verdict).toBe("restricted");
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "United States (Remote)" }).verdict).toBe("restricted");
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "USA, Canada, USA timezones" }).verdict).toBe("restricted");
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "Remote, AMER" }).verdict).toBe("restricted");
  });
  it("a Worldwide label is overridden by a right-to-work sentence", () => {
    const r = classifyRemoteEligibility({ title: "Dev", description: "Must be authorized to work in the United States.", locationLabel: "Worldwide" });
    expect(r.verdict).toBe("restricted");
    expect(r.basis).toBe("text");
  });
  it("a bare Remote label falls back to the text", () => {
    expect(classifyRemoteEligibility({ title: "Dev", description: "You can work from anywhere in the world.", locationLabel: "Remote" }).verdict).toBe("open");
    expect(classifyRemoteEligibility({ title: "Dev", description: "Candidates must be located in the EU.", locationLabel: "Remote" }).verdict).toBe("restricted");
    expect(classifyRemoteEligibility({ title: "Dev", description: d, locationLabel: "Remote" }).verdict).toBe("unclear");
  });
  it("time-zone overlap requirements are restrictions", () => {
    const r = classifyRemoteEligibility({ title: "Dev", description: "<p>You will need at least 4 hours of overlap with Pacific time.</p>" });
    expect(r.verdict).toBe("restricted");
  });
  it("strips HTML before matching", () => {
    expect(stripHtml("<p>Hello&nbsp;<b>world</b></p><br>Next")).toBe("Hello world\nNext");
  });
});

describe("jobEligibility in matching", () => {
  it("classifies only remote listings and keeps EU-only ones out of the match list", () => {
    expect(jobEligibility(jobs.find((j) => j.id === "j001")!)).toBeNull();
    expect(jobEligibility(jobs.find((j) => j.id === "j011")!)?.verdict).toBe("restricted");
    expect(jobEligibility(jobs.find((j) => j.id === "j004")!)?.verdict).toBe("open");
    const role = roles.find((r) => r.id === "frontend_developer")!;
    const ids = matchJobs(sampleProfile, role, jobs, { now: new Date("2026-10-20T00:00:00Z"), limit: 50 }).map((m) => m.job.id);
    expect(ids).not.toContain("j011");
    const va = matchJobs(sampleProfile, roles.find((r) => r.id === "virtual_assistant")!, jobs, { now: new Date("2026-10-20T00:00:00Z"), limit: 50 }).find((m) => m.job.id === "j004");
    expect(va?.eligibility?.verdict).toBe("open");
  });
});
