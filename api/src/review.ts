import type { Job, RemoteEligibility, ScamVerdict } from "@byv/core";
import { jobEligibility, screenJob, jobs } from "@byv/core";

// In-memory admin review queue. The MVP replaces this with a Postgres table; the shape
// (automatic verdict + optional human decision + audit trail) is what carries over.

export type Decision = "approved" | "rejected";
export type ReviewReason = "scam" | "eligibility" | "report";
export type ReviewItem = {
  job: Job;
  automatic: ScamVerdict;
  eligibility?: RemoteEligibility; // remote listings only (BR-062)
  reasons: ReviewReason[]; // why the listing is in the queue
  reportCount: number;
  decision?: Decision;
  decidedBy?: string;
  decidedAt?: string;
  note?: string;
};

const decisions = new Map<string, Pick<ReviewItem, "decision" | "decidedBy" | "decidedAt" | "note">>();
const reports = new Map<string, { count: number; reasons: string[] }>();

// User reports (ADR-0010). One report from a user suppresses a listing pending human review;
// a listing from a verified employer needs two independent reports because verified employers
// are the likeliest target of competitor or spite reports. Each reporter may file at most
// three reports in a rolling 24 hours; reports beyond that are recorded as not accepted.
export const REPORT_THRESHOLD = 1;
export const VERIFIED_EMPLOYER_REPORT_THRESHOLD = 2;
export const REPORTS_PER_REPORTER_PER_DAY = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Employer domains that carry the BR-004 verified badge. Empty until employer verification ships (Phase 2). */
export const verifiedEmployerDomains = new Set<string>();

// Timestamps (ms) of accepted reports per reporter id, pruned to the rolling window on each call.
const reporterLog = new Map<string, number[]>();

function suppressionThreshold(job: Job): number {
  const domain = job.companyDomain?.toLowerCase();
  return domain && verifiedEmployerDomains.has(domain) ? VERIFIED_EMPLOYER_REPORT_THRESHOLD : REPORT_THRESHOLD;
}

function toItem(job: Job): ReviewItem {
  const automatic = screenJob(job);
  const eligibility = jobEligibility(job) ?? undefined;
  const reasons: ReviewReason[] = [];
  if (automatic.status !== "pass") reasons.push("scam");
  if (eligibility && eligibility.verdict !== "open") reasons.push("eligibility");
  if (reports.has(job.id)) reasons.push("report");
  return { job, automatic, eligibility, reasons, reportCount: reportsFor(job.id).count, ...decisions.get(job.id) };
}

/** Every listing that did not pass both screens cleanly, was reported, or carries a human decision. */
export function listReviewItems(): ReviewItem[] {
  return jobs
    .map(toItem)
    .filter((i) => i.reasons.length > 0 || i.decision)
    .sort((a, b) => (a.decision ? 1 : 0) - (b.decision ? 1 : 0));
}

/** Counts for the admin header: how the corpus splits between published, queued and excluded. */
export function corpusStats() {
  const items = jobs.map(toItem);
  const published = new Set(publishableJobs().map((j) => j.id));
  return {
    total: jobs.length,
    published: published.size,
    awaitingReview: items.filter((i) => !i.decision && i.reasons.length > 0 && !published.has(i.job.id) && i.automatic.status !== "fail" && i.eligibility?.verdict !== "restricted").length,
    scamFail: items.filter((i) => i.automatic.status === "fail").length,
    remoteRestricted: items.filter((i) => i.eligibility?.verdict === "restricted").length,
    remoteUnclear: items.filter((i) => i.eligibility?.verdict === "unclear" && !i.decision).length,
    reported: items.filter((i) => i.reportCount > 0).length,
  };
}

export function decide(jobId: string, decision: Decision, decidedBy: string, note?: string): ReviewItem | null {
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return null;
  decisions.set(jobId, { decision, decidedBy, decidedAt: new Date().toISOString(), note });
  return toItem(job);
}

/**
 * Record a user report. `reporterId` is the caller's user id, or the client IP while there is
 * no authentication. Reports beyond the third from the same reporter in a rolling 24 hours
 * are ignored and returned with `accepted: false`; `count` is the listing's accepted total.
 */
export function reportJob(jobId: string, reason: string, reporterId: string, now: number = Date.now()): { count: number; accepted: boolean } {
  const recent = (reporterLog.get(reporterId) ?? []).filter((t) => now - t < DAY_MS);
  reporterLog.set(reporterId, recent);
  if (recent.length >= REPORTS_PER_REPORTER_PER_DAY) {
    return { count: reportsFor(jobId).count, accepted: false };
  }
  recent.push(now);

  const r = reports.get(jobId) ?? { count: 0, reasons: [] };
  r.count += 1;
  r.reasons.push(reason);
  reports.set(jobId, r);
  return { count: r.count, accepted: true };
}

export function reportsFor(jobId: string) {
  return reports.get(jobId) ?? { count: 0, reasons: [] };
}

/**
 * Jobs eligible for digests: automatic pass, or human-approved; never human-rejected, and never
 * reported once (twice for a verified employer) unless a human has since approved it (ADR-0010).
 */
export function publishableJobs(): Job[] {
  return jobs.filter((j) => {
    const d = decisions.get(j.id);
    if (d?.decision === "rejected") return false;
    if (jobEligibility(j)?.verdict === "restricted") return false;
    if ((reports.get(j.id)?.count ?? 0) >= suppressionThreshold(j) && d?.decision !== "approved") return false;
    if (d?.decision === "approved") return true;
    // A remote listing that excludes Nigeria is never published, even by approval (BRL-017);
    // an "unclear" one waits for a human (BR-062).
    const eligibility = jobEligibility(j);
    if (eligibility && eligibility.verdict !== "open") return false;
    return screenJob(j).status === "pass";
  });
}
