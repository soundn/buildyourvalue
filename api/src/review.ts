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

export function reportJob(jobId: string, reason: string) {
  const r = reports.get(jobId) ?? { count: 0, reasons: [] };
  r.count += 1;
  r.reasons.push(reason);
  reports.set(jobId, r);
  return r;
}

export function reportsFor(jobId: string) {
  return reports.get(jobId) ?? { count: 0, reasons: [] };
}

/** Jobs eligible for digests: automatic pass, or human-approved; never human-rejected or reported twice. */
export function publishableJobs(): Job[] {
  return jobs.filter((j) => {
    const d = decisions.get(j.id);
    if (d?.decision === "rejected") return false;
    if ((reports.get(j.id)?.count ?? 0) >= 2 && d?.decision !== "approved") return false;
    if (d?.decision === "approved") return true;
    return screenJob(j).status === "pass";
  });
}
