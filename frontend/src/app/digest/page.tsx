"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, type Evaluation } from "@/lib/api";
import { loadProfile } from "@/lib/storage";

// Preview of the email digest. The MVP renders this same content server-side and sends it
// through SES or Resend with one-click unsubscribe headers (NFR on deliverability).
export default function DigestPreview() {
  const [ev, setEv] = useState<Evaluation | null>(null);
  const [name, setName] = useState("there");
  useEffect(() => {
    const p = loadProfile();
    if (!p) return;
    setName(p.basics.name.split(" ")[0] || "there");
    api.evaluate(p).then(setEv).catch(() => setEv(null));
  }, []);

  const picks = ev?.matches.filter((m) => m.scam.status === "pass").slice(0, 5) ?? [];

  return (
    <div className="space-y-4">
      <div className="no-print flex items-center justify-between">
        <Link href="/dashboard" className="text-sm underline">Back to dashboard</Link>
        <span className="text-xs text-[var(--muted)]">Email preview. Sent 3x weekly on Core.</span>
      </div>
      <div className="bg-white border border-[var(--line)] rounded-lg overflow-hidden max-w-xl mx-auto">
        <div className="bg-[var(--brand)] text-white px-5 py-4">
          <p className="text-xs opacity-80">Build Your Value · a SoundTechWorks solution</p>
          <h1 className="text-lg font-semibold">{picks.length} jobs you can actually get this week, {name}</h1>
        </div>
        <div className="p-5 space-y-4 text-[15px]">
          {!ev && <p className="text-[var(--muted)]">Build a CV first to see your personalised digest.</p>}
          {ev && (
            <>
              <p>Your CV strength is <strong>{ev.report.total}/100</strong>. {ev.report.components.sort((a, b) => a.score - b.score)[0]?.fix}</p>
              {picks.map((m) => (
                <div key={m.job.id} className="border-t border-[var(--line)] pt-3">
                  <div className="flex justify-between gap-3"><strong>{m.job.title}</strong><span className="text-sm font-semibold text-[var(--brand)]">{m.fit}% fit</span></div>
                  <p className="text-sm text-[var(--muted)]">{m.job.company} · {m.job.location} · {m.job.workType}</p>
                  <p className="text-sm mt-1">{m.reasons[0]}</p>
                  <a href={m.job.applyUrl} className="text-sm underline">Apply on employer site</a>
                </div>
              ))}
              {ev.path.steps[0] && (
                <div className="border-t border-[var(--line)] pt-3 text-sm">
                  <strong>Next step on your path:</strong> {ev.path.steps[0].course.title} ({ev.path.steps[0].course.provider}, {ev.path.steps[0].course.hours}h, {ev.path.steps[0].course.cost === "paid" ? "paid" : "free"}). Finish it and we re-match you.
                </div>
              )}
            </>
          )}
          <p className="text-xs text-[var(--muted)] border-t border-[var(--line)] pt-3">
            Every listing above passed our fee, contact and impersonation screen. We never charge you to apply. Reply to report a listing. Unsubscribe in one click. SoundTechWorks, Lagos, Nigeria.
          </p>
        </div>
      </div>
    </div>
  );
}
