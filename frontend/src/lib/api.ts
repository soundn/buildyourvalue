import type { Profile, Role, WeaknessReport, Match, LearningPath, IntakeQuestion, IntakePreferences, HiddenSummary } from "@byv/core";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type Evaluation = { role: Role; report: WeaknessReport; matches: Match[]; path: LearningPath; hidden: HiddenSummary; years: number };
export type IntakeStep = { done: boolean; engine: "claude" | "rules"; question: IntakeQuestion | null; progress: { answered: number; total: number }; preferences: IntakePreferences };
export type Improvement = { engine: "claude" | "rules"; profile: Profile; changes: string[]; before: number; after: number };

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`${path} failed (${res.status})`);
  return res.json() as Promise<T>;
}

export const api = {
  evaluate: (profile: Profile) => post<Evaluation>("/v1/evaluate", profile),
  improve: (profile: Profile) => post<Improvement>("/v1/cv/improve", profile),
  intakeNext: (answers: Record<string, string[]>) => post<IntakeStep>("/v1/intake/next", { answers }),
  report: (jobId: string, reason: string) => post<{ ok: boolean }>(`/v1/jobs/${jobId}/report`, { reason }),
  health: async () => {
    try {
      const r = await fetch(`${API_URL}/health`, { cache: "no-store" });
      return (await r.json()) as { ok: boolean; ai: boolean };
    } catch {
      return null;
    }
  },
};
