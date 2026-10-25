import type { Job, RemoteEligibility, ScamVerdict } from "@byv/core";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ReviewReason = "scam" | "eligibility" | "report";
export type ReviewItem = { job: Job; automatic: ScamVerdict; eligibility?: RemoteEligibility; reasons: ReviewReason[]; reportCount: number; decision?: "approved" | "rejected"; decidedBy?: string; decidedAt?: string; note?: string };
export type CorpusStats = { total: number; published: number; awaitingReview: number; scamFail: number; remoteRestricted: number; remoteUnclear: number; reported: number };

export async function fetchStats(): Promise<CorpusStats> {
  const r = await fetch(`${API_URL}/v1/admin/stats`, { cache: "no-store" });
  if (!r.ok) throw new Error(`stats failed (${r.status})`);
  return r.json();
}

export async function fetchQueue(): Promise<ReviewItem[]> {
  const r = await fetch(`${API_URL}/v1/admin/review`, { cache: "no-store" });
  if (!r.ok) throw new Error(`queue failed (${r.status})`);
  return r.json();
}

export async function decide(jobId: string, decision: "approved" | "rejected", note?: string): Promise<ReviewItem> {
  const r = await fetch(`${API_URL}/v1/admin/review/${jobId}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ decision, decidedBy: "admin@soundtechworks", note }) });
  if (!r.ok) throw new Error(`decision failed (${r.status})`);
  return r.json();
}
