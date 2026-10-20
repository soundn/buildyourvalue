"use client";
import { useEffect, useState } from "react";
import { decide, fetchQueue, type ReviewItem } from "@/lib/api";

const badge: Record<string, string> = { fail: "bg-red-100 text-red-800", review: "bg-amber-100 text-amber-800", pass: "bg-green-100 text-green-800" };

export default function ReviewQueue() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = () => fetchQueue().then(setItems).catch((e) => setError(e.message));
  useEffect(() => { void load(); }, []);

  async function act(id: string, decision: "approved" | "rejected") {
    try {
      await decide(id, decision);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed");
    }
  }

  const open = items.filter((i) => !i.decision);
  const closed = items.filter((i) => i.decision);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Listing review queue</h1>
        <p className="text-sm text-gray-600">Automatic screen results for every listing that did not pass cleanly. Approve to publish, reject to suppress. Decisions are audited.</p>
      </div>
      {error && <div className="rounded bg-red-50 border border-red-200 text-red-800 p-3 text-sm">{error}. Is the API running on the configured URL?</div>}

      <section className="space-y-3">
        <h2 className="font-semibold">Open ({open.length})</h2>
        {open.length === 0 && <p className="text-sm text-gray-600">Nothing waiting.</p>}
        {open.map((i) => <Row key={i.job.id} item={i} onAct={act} />)}
      </section>
      <section className="space-y-3">
        <h2 className="font-semibold">Decided ({closed.length})</h2>
        {closed.map((i) => <Row key={i.job.id} item={i} onAct={act} />)}
      </section>
    </div>
  );
}

function Row({ item, onAct }: { item: ReviewItem; onAct: (id: string, d: "approved" | "rejected") => void }) {
  const { job, automatic } = item;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 grid md:grid-cols-[1fr_auto] gap-3">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${badge[automatic.status]}`}>auto: {automatic.status}</span>
          {item.decision && <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-800 text-white">human: {item.decision} by {item.decidedBy}</span>}
          <span className="text-xs text-gray-500">{job.source} · posted {job.postedAt}</span>
        </div>
        <h3 className="font-semibold">{job.title} <span className="font-normal text-gray-600">· {job.company}{job.companyDomain ? ` (${job.companyDomain})` : " (no domain)"}</span></h3>
        <p className="text-sm text-gray-700">{job.description}</p>
        <ul className="text-sm text-amber-900 list-disc pl-5">{automatic.flags.map((f) => <li key={f}>{f}</li>)}</ul>
        <p className="text-xs text-gray-500">Contact: {job.contactEmail ?? "none"} · Apply: {job.applyUrl}</p>
      </div>
      <div className="flex md:flex-col gap-2 self-start">
        <button type="button" onClick={() => onAct(job.id, "approved")} className="px-3 py-1.5 rounded bg-green-700 text-white text-sm">Approve</button>
        <button type="button" onClick={() => onAct(job.id, "rejected")} className="px-3 py-1.5 rounded bg-red-700 text-white text-sm">Reject</button>
      </div>
    </div>
  );
}
