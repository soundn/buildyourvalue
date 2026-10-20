"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Profile } from "@byv/core";
import { roles } from "@byv/core";
import { loadProfile } from "@/lib/storage";

function fmt(d?: string) {
  if (!d) return "Present";
  const [y, m] = d.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return m ? `${months[Number(m) - 1]} ${y}` : y;
}

export default function CvPage() {
  const [p, setP] = useState<Profile | null>(null);
  useEffect(() => setP(loadProfile()), []);
  if (!p) return <p className="text-[var(--muted)]">No CV yet. <Link href="/onboard" className="underline">Build one</Link>.</p>;
  const role = roles.find((r) => r.id === p.targetRole);

  return (
    <div className="space-y-4">
      <div className="no-print flex items-center justify-between">
        <Link href="/dashboard" className="text-sm underline">Back to dashboard</Link>
        <button type="button" onClick={() => window.print()} className="px-3 py-1.5 rounded-md bg-[var(--brand)] text-white text-sm font-medium">Download as PDF</button>
      </div>
      <article className="bg-white border border-[var(--line)] rounded-lg p-6 sm:p-8 text-[15px] leading-relaxed print:border-0 print:p-0">
        <header className="border-b border-[var(--line)] pb-3">
          <h1 className="text-2xl font-bold">{p.basics.name || "Your name"}</h1>
          <p className="text-sm text-[var(--muted)]">{[p.basics.phone, p.basics.email, p.basics.location].filter(Boolean).join(" · ")}</p>
          {role && <p className="text-sm font-medium mt-1">{role.title}</p>}
        </header>
        {p.basics.summary && (
          <section className="mt-4"><h2 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Summary</h2><p className="mt-1">{p.basics.summary}</p></section>
        )}
        {p.work.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Experience</h2>
            {p.work.map((w, i) => (
              <div key={i} className="mt-2">
                <div className="flex justify-between gap-3"><strong>{w.position}</strong><span className="text-sm text-[var(--muted)]">{fmt(w.startDate)} to {fmt(w.endDate)}</span></div>
                <div className="text-sm">{w.company}</div>
                <ul className="list-disc pl-5 mt-1">{w.highlights.map((h, j) => <li key={j}>{h}</li>)}</ul>
              </div>
            ))}
          </section>
        )}
        {p.education.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Education</h2>
            {p.education.map((e, i) => (
              <div key={i} className="mt-1 flex justify-between gap-3"><span><strong>{e.studyType}</strong>, {e.area}, {e.institution}{e.grade ? ` (${e.grade})` : ""}</span><span className="text-sm text-[var(--muted)]">{e.endDate}</span></div>
            ))}
            {p.nyscStatus === "completed" && <p className="text-sm mt-1">NYSC: completed</p>}
          </section>
        )}
        {p.skills.length > 0 && (
          <section className="mt-4"><h2 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Skills</h2><p className="mt-1">{p.skills.join(" · ")}</p></section>
        )}
        {p.certifications.length > 0 && (
          <section className="mt-4"><h2 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Certifications</h2><p className="mt-1">{p.certifications.join(" · ")}</p></section>
        )}
      </article>
    </div>
  );
}
