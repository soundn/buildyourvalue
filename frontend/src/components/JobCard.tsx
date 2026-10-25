"use client";
import type { Match } from "@byv/core";
import { useState } from "react";
import { api } from "@/lib/api";

const ngn = (n?: number) => (n ? `₦${n.toLocaleString("en-NG")}` : "");

export function JobCard({ match }: { match: Match }) {
  const { job, fit, reasons, gaps, scam } = match;
  const [reported, setReported] = useState(false);
  const fitColor = fit >= 70 ? "bg-green-100 text-green-800" : fit >= 50 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700";

  return (
    <article className="rounded-lg border border-[var(--line)] bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-tight">{job.title}</h3>
          <p className="text-sm text-[var(--muted)]">
            {job.company} · {job.location} · {job.workType}
            {job.salaryMin ? ` · ${ngn(job.salaryMin)}${job.salaryMax ? ` to ${ngn(job.salaryMax)}` : ""}/mo` : ""}
          </p>
        </div>
        <span className={`shrink-0 text-sm font-semibold px-2 py-1 rounded ${fitColor}`}>{fit}% fit</span>
      </div>
      {match.eligibility?.verdict === "open" && (
        <p className="text-xs font-medium text-[var(--brand)]">Hires in Nigeria</p>
      )}

      {scam.status === "review" && (
        <div className="text-sm rounded bg-amber-50 border border-amber-200 text-amber-900 p-2">
          <strong>Under review.</strong> {scam.flags[0]} Do not pay anyone and do not share bank details.
        </div>
      )}

      <ul className="text-sm space-y-1">
        {reasons.map((r) => (
          <li key={r} className="flex gap-2"><span aria-hidden>✓</span><span>{r}</span></li>
        ))}
      </ul>
      {gaps.length > 0 && (
        <p className="text-sm text-[var(--muted)]">Not yet on your CV: {gaps.join(", ")}.</p>
      )}

      <div className="flex items-center justify-between gap-3 pt-1">
        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white bg-[var(--brand)] px-3 py-1.5 rounded-md">
          Apply on employer site
        </a>
        <button
          type="button"
          disabled={reported}
          onClick={async () => {
            await api.report(job.id, "user_flag").catch(() => undefined);
            setReported(true);
          }}
          className="text-xs text-[var(--muted)] underline disabled:no-underline"
        >
          {reported ? "Reported. Thank you." : "Report this listing"}
        </button>
      </div>
    </article>
  );
}
