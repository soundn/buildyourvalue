import type { Job, ScamVerdict } from "@byv/core";
import { screenJob, jobs } from "@byv/core";

// In-memory admin review queue. The MVP replaces this with a Postgres table; the shape
// (automatic verdict + optional human decision + audit trail) is what carries over.

export type Decision = "approved" | "rejected";
export type ReviewItem = {
  job: Job;
  automatic: ScamVerdict;
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

export function listReviewItems(): ReviewItem[] {
  return jobs
    .map((job) => ({ job, automatic: screenJob(job), ...decisions.get(job.id) }))
    .filter((i) => i.automatic.status !== "pass" || i.decision || reports.has(i.job.id))
    .sort((a, b) => (a.decision ? 1 : 0) - (b.decision ? 1 : 0));
}

export function decide(jobId: string, decision: Decision, decidedBy: string, note?: string): ReviewItem | null {
  const job = jobs.find((j) => j.id === jobId);
  if (!job) return null;
  decisions.set(jobId, { decision, decidedBy, decidedAt: new Date().toISOString(), note });
  return { job, automatic: screenJob(job), ...decisions.get(jobId) };
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
    if ((reports.get(j.id)?.count ?? 0) >= suppressionThreshold(j) && d?.decision !== "approved") return false;
    if (d?.decision === "approved") return true;
    return screenJob(j).status === "pass";
  });
}
