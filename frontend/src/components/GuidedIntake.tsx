"use client";
import { useEffect, useState } from "react";
import type { IntakePreferences, IntakeQuestion } from "@byv/core";
import { api } from "@/lib/api";

type Props = { onComplete: (prefs: IntakePreferences, answers: Record<string, string[]>) => void; onUnavailable: () => void };

// Up to seven tappable questions (BR-064). The API decides the next question and maps the
// answers to preferences; this component only renders chips and collects taps.
export function GuidedIntake({ onComplete, onUnavailable }: Props) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [question, setQuestion] = useState<IntakeQuestion | null>(null);
  const [progress, setProgress] = useState({ answered: 0, total: 7 });
  const [picked, setPicked] = useState<string[]>([]);
  const [free, setFree] = useState("");
  const [busy, setBusy] = useState(true);

  async function advance(next: Record<string, string[]>) {
    setBusy(true);
    try {
      const step = await api.intakeNext(next);
      setProgress(step.progress);
      if (step.done) {
        onComplete(step.preferences, next);
        return;
      }
      setQuestion(step.question);
      setPicked(next[step.question!.id] ?? []);
      setFree("");
    } catch {
      onUnavailable();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void advance({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!question) return <p className="text-sm text-[var(--muted)]">{busy ? "Loading your first question\u2026" : ""}</p>;

  const toggle = (value: string) => {
    if (!question.multi) return setPicked([value]);
    setPicked((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : prev.length < (question.max ?? 99) ? [...prev, value] : prev));
  };
  const submit = () => {
    const values = [...picked, ...(free.trim() ? [free.trim()] : [])];
    if (!values.length) return;
    const next = { ...answers, [question.id]: values };
    setAnswers(next);
    void advance(next);
  };
  const back = () => {
    const ids = Object.keys(answers);
    if (!ids.length) return;
    const next = { ...answers };
    delete next[ids[ids.length - 1]];
    setAnswers(next);
    void advance(next);
  };

  return (
    <section className="space-y-4" aria-live="polite">
      <p className="text-xs text-[var(--muted)]">Question {Math.min(progress.answered + 1, progress.total)} of {progress.total}</p>
      <h2 className="text-lg font-semibold">{question.prompt}</h2>
      {question.help && <p className="text-sm text-[var(--muted)]">{question.help}</p>}
      <div className="flex flex-wrap gap-2">
        {question.options.map((o) => {
          const on = picked.includes(o.value);
          return (
            <button key={o.value} type="button" onClick={() => toggle(o.value)} aria-pressed={on} className={`min-h-11 px-3 py-2 rounded-full border text-sm ${on ? "bg-[var(--brand)] text-white border-[var(--brand)]" : "bg-white border-[var(--line)]"}`}>
              {o.label}
            </button>
          );
        })}
      </div>
      {question.allowFreeText && (
        <input className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-base" placeholder="Or type your own" value={free} onChange={(e) => setFree(e.target.value)} />
      )}
      <div className="flex justify-between">
        <button type="button" onClick={back} disabled={busy || !Object.keys(answers).length} className="px-4 py-2 rounded-md border border-[var(--line)] bg-white disabled:opacity-40">Back</button>
        <button type="button" onClick={submit} disabled={busy || (!picked.length && !free.trim())} className="px-4 py-2 rounded-md bg-[var(--brand)] text-white font-medium disabled:opacity-40">
          {busy ? "One moment" : "Continue"}
        </button>
      </div>
    </section>
  );
}
