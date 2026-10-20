import Link from "next/link";

const steps = [
  { n: 1, title: "Build your CV in one sitting", body: "Answer a short form. We turn it into a clean, ATS-friendly CV and show you exactly where it is weak." },
  { n: 2, title: "Get fit-scored, screened jobs", body: "Fresh listings only, each with a fit score and a plain reason why. Scam patterns are filtered before you see them." },
  { n: 3, title: "Close the gap, then re-match", body: "A three-step learning path from free sources. Finish a step and your fit score moves." },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="pt-4 space-y-4">
        <p className="inline-block text-xs font-semibold tracking-wide uppercase text-[var(--brand)] bg-green-50 px-2 py-1 rounded">A SoundTechWorks solution</p>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">Get shortlisted, not scammed.</h1>
        <p className="text-lg text-[var(--muted)]">
          An AI-assisted CV, verified job matches sent to your inbox, and a learning path that measurably lifts your chances. Built for Nigerian job seekers.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/onboard" className="px-5 py-3 rounded-md bg-[var(--brand)] text-white font-semibold">Build my free CV</Link>
          <Link href="/pricing" className="px-5 py-3 rounded-md border border-[var(--line)] bg-white font-semibold">See pricing</Link>
        </div>
        <p className="text-sm text-[var(--muted)]">Free to start. No card needed. We never charge you to apply.</p>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div key={s.n} className="rounded-lg bg-white border border-[var(--line)] p-4">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--ink)] font-bold grid place-items-center">{s.n}</div>
            <h2 className="font-semibold mt-3">{s.title}</h2>
            <p className="text-sm text-[var(--muted)] mt-1">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg bg-white border border-[var(--line)] p-5 space-y-2">
        <h2 className="font-semibold text-lg">Why this is different</h2>
        <ul className="text-sm space-y-2 text-[var(--muted)]">
          <li><strong className="text-[var(--ink)]">Trust first.</strong> Every listing passes a fee, contact and impersonation screen. One report from you suppresses it pending review.</li>
          <li><strong className="text-[var(--ink)]">Relevance, not volume.</strong> A short digest of jobs you can actually get, with the reason spelled out, instead of 200 unread alerts.</li>
          <li><strong className="text-[var(--ink)]">A path, not a paywall.</strong> If your CV is weak we say so, show the three skills that matter most, and point to free courses first.</li>
        </ul>
      </section>
    </div>
  );
}
