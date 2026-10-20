"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Profile } from "@byv/core";
import { api, type Evaluation, type Improvement } from "@/lib/api";
import { loadProfile, saveProfile } from "@/lib/storage";
import { ScoreRing } from "@/components/ScoreRing";
import { JobCard } from "@/components/JobCard";

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [improvement, setImprovement] = useState<Improvement | null>(null);
  const [busy, setBusy] = useState<"evaluate" | "improve" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noProfile, setNoProfile] = useState(false);

  async function evaluate(p: Profile) {
    setBusy("evaluate");
    setError(null);
    try {
      setEvaluation(await api.evaluate(p));
    } catch (e) {
      setError(`Could not reach the API at the configured URL. Is the api workspace running? (${e instanceof Error ? e.message : "error"})`);
    } finally {
      setBusy(null);
    }
  }

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      setNoProfile(true);
      return;
    }
    setProfile(p);
    void evaluate(p);
  }, []);

  async function improve() {
    if (!profile) return;
    setBusy("improve");
    setError(null);
    try {
      const result = await api.improve(profile);
      setImprovement(result);
      setProfile(result.profile);
      saveProfile(result.profile);
      await evaluate(result.profile);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Improvement failed");
      setBusy(null);
    }
  }

  if (noProfile) {
    return (
      <div className="rounded-lg bg-white border border-[var(--line)] p-6 text-center space-y-3">
        <h1 className="text-xl font-semibold">No CV yet</h1>
        <p className="text-[var(--muted)]">Build your CV first. It takes about five minutes.</p>
        <Link href="/onboard" className="inline-block px-4 py-2 rounded-md bg-[var(--brand)] text-white font-medium">Start</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{profile?.basics.name ? `${profile.basics.name.split(" ")[0]}, here is where you stand` : "Your dashboard"}</h1>
          {evaluation && <p className="text-[var(--muted)]">Target: {evaluation.role.title} · {evaluation.years} year(s) of experience counted</p>}
        </div>
        <div className="flex gap-2 text-sm">
          <Link href="/onboard" className="px-3 py-1.5 rounded-md border border-[var(--line)] bg-white">Edit CV</Link>
          <Link href="/cv" className="px-3 py-1.5 rounded-md border border-[var(--line)] bg-white">View CV</Link>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 border border-red-200 text-red-800 p-3 text-sm">{error}</div>}
      {busy === "evaluate" && !evaluation && <p className="text-[var(--muted)]">Scoring your CV and screening listings…</p>}

      {evaluation && (
        <>
          <section className="rounded-lg bg-white border border-[var(--line)] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ScoreRing value={evaluation.report.total} label="CV strength" />
              <button type="button" onClick={improve} disabled={busy !== null} className="px-4 py-2 rounded-md bg-[var(--brand)] text-white font-medium disabled:opacity-50">
                {busy === "improve" ? "Improving…" : "Improve my CV with AI"}
              </button>
            </div>
            {improvement && (
              <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm space-y-1">
                <p className="font-medium">Score moved from {improvement.before} to {improvement.after} ({improvement.engine === "claude" ? "Claude rewrite" : "rule-based rewrite; add an API key for the AI version"}).</p>
                <ul className="list-disc pl-5">{improvement.changes.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              {evaluation.report.components.map((c) => (
                <div key={c.id} className="rounded-md border border-[var(--line)] p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{c.label}</h3>
                    <span className="text-sm font-semibold">{c.score}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--surface-2)] rounded mt-2"><div className="h-1.5 rounded bg-[var(--brand)]" style={{ width: `${c.score}%` }} /></div>
                  <p className="text-xs text-[var(--muted)] mt-2">{c.finding}</p>
                  <p className="text-xs mt-1"><strong>Fix:</strong> {c.fix}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Jobs you can actually get</h2>
              <Link href="/digest" className="text-sm underline">Preview the email digest</Link>
            </div>
            <p className="text-sm text-[var(--muted)]">Fresh listings only, screened for scams, ranked by fit. {evaluation.matches.length} shown.</p>
            <div className="space-y-3">{evaluation.matches.map((m) => <JobCard key={m.job.id} match={m} />)}</div>
          </section>

          <section className="rounded-lg bg-white border border-[var(--line)] p-5 space-y-3">
            <h2 className="text-xl font-semibold">Your learning path</h2>
            <p className="text-sm text-[var(--muted)]">
              Three steps, free sources first. About {evaluation.path.estimatedHours} hours in total. Projected lift to your fit scores: about {evaluation.path.projectedFitLift} points.
            </p>
            <ol className="space-y-3">
              {evaluation.path.steps.map((s) => (
                <li key={s.step} className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--accent)] grid place-items-center font-bold">{s.step}</div>
                  <div>
                    <p className="font-medium">Learn {s.skill}</p>
                    <p className="text-sm">{s.course.title} · {s.course.provider} · {s.course.hours}h · {s.course.cost === "free" ? "Free" : s.course.cost === "free_with_aid" ? "Free with financial aid" : "Paid"}{s.course.certificate ? " · Certificate" : ""}</p>
                    <p className="text-xs text-[var(--muted)]">{s.why}</p>
                    <a href={s.course.url} target="_blank" rel="noopener noreferrer" className="text-sm underline">Open course{s.course.affiliate ? " (affiliate link)" : ""}</a>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}
