"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@byv/core";
import { roles } from "@byv/core";
import { emptyProfile, loadProfile, saveProfile } from "@/lib/storage";
import { API_URL } from "@/lib/api";

const input = "w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-base";
const label = "block text-sm font-medium mb-1";

export default function Onboard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<Profile>(emptyProfile);
  const [skillsText, setSkillsText] = useState("");
  const [certsText, setCertsText] = useState("");

  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setP(saved);
      setSkillsText(saved.skills.join(", "));
      setCertsText(saved.certifications.join(", "));
    }
  }, []);

  const update = (patch: Partial<Profile>) => setP((prev) => ({ ...prev, ...patch }));
  const updateBasics = (k: keyof Profile["basics"], v: string) => setP((prev) => ({ ...prev, basics: { ...prev.basics, [k]: v } }));

  async function loadSample() {
    const res = await fetch(`${API_URL}/v1/sample-profile`).catch(() => null);
    if (!res?.ok) return;
    const sample = (await res.json()) as Profile;
    setP(sample);
    setSkillsText(sample.skills.join(", "));
    setCertsText(sample.certifications.join(", "));
  }

  function finish() {
    const final: Profile = {
      ...p,
      skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
      certifications: certsText.split(",").map((s) => s.trim()).filter(Boolean),
      work: p.work.filter((w) => w.company || w.position).map((w) => ({ ...w, highlights: w.highlights.filter((h) => h.trim()) })),
      education: p.education.filter((e) => e.institution || e.area),
    };
    saveProfile(final);
    router.push("/dashboard");
  }

  const steps = ["About you", "Target role", "Experience", "Education and skills"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Build your CV</h1>
        <button type="button" onClick={loadSample} className="text-sm underline text-[var(--muted)]">Load a sample profile</button>
      </div>
      <ol className="flex gap-2 text-xs">
        {steps.map((s, i) => (
          <li key={s} className={`flex-1 border-t-4 pt-1 ${i <= step ? "border-[var(--brand)]" : "border-[var(--line)] text-[var(--muted)]"}`}>{s}</li>
        ))}
      </ol>

      {step === 0 && (
        <section className="space-y-3">
          <div><label className={label}>Full name</label><input className={input} value={p.basics.name} onChange={(e) => updateBasics("name", e.target.value)} autoComplete="name" /></div>
          <div><label className={label}>Email</label><input className={input} type="email" value={p.basics.email} onChange={(e) => updateBasics("email", e.target.value)} autoComplete="email" /></div>
          <div><label className={label}>Phone (for WhatsApp and recruiters)</label><input className={input} type="tel" inputMode="tel" placeholder="0803 123 4567" value={p.basics.phone} onChange={(e) => updateBasics("phone", e.target.value)} autoComplete="tel" /></div>
          <div><label className={label}>City and state</label><input className={input} placeholder="Lagos, Lagos" value={p.basics.location} onChange={(e) => updateBasics("location", e.target.value)} /></div>
          <div>
            <label className={label}>NYSC status</label>
            <select className={input} value={p.nyscStatus} onChange={(e) => update({ nyscStatus: e.target.value as Profile["nyscStatus"] })}>
              <option value="completed">Completed</option><option value="serving">Currently serving</option><option value="exempted">Exempted</option><option value="not_yet">Not yet</option><option value="na">Not applicable</option>
            </select>
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-3">
          <div>
            <label className={label}>What role are you targeting?</label>
            <select className={input} value={p.targetRole} onChange={(e) => update({ targetRole: e.target.value })}>
              {roles.map((r) => <option key={r.id} value={r.id}>{r.title} ({r.family})</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Work preference</label>
            <select className={input} value={p.workPreference} onChange={(e) => update({ workPreference: e.target.value as Profile["workPreference"] })}>
              <option value="any">Any</option><option value="onsite">On-site</option><option value="hybrid">Hybrid</option><option value="remote">Remote only</option>
            </select>
          </div>
          <div>
            <label className={label}>Professional summary (optional, we can draft it)</label>
            <textarea className={input} rows={3} value={p.basics.summary} onChange={(e) => updateBasics("summary", e.target.value)} />
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <p className="text-sm text-[var(--muted)]">Internships, NYSC placements, volunteering and freelance work all count.</p>
          {p.work.map((w, i) => (
            <div key={i} className="rounded-lg border border-[var(--line)] bg-white p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input className={input} placeholder="Company" value={w.company} onChange={(e) => setP((prev) => { const work = [...prev.work]; work[i] = { ...w, company: e.target.value }; return { ...prev, work }; })} />
                <input className={input} placeholder="Position" value={w.position} onChange={(e) => setP((prev) => { const work = [...prev.work]; work[i] = { ...w, position: e.target.value }; return { ...prev, work }; })} />
                <input className={input} type="month" value={w.startDate} onChange={(e) => setP((prev) => { const work = [...prev.work]; work[i] = { ...w, startDate: e.target.value }; return { ...prev, work }; })} aria-label="Start date" />
                <input className={input} type="month" value={w.endDate ?? ""} onChange={(e) => setP((prev) => { const work = [...prev.work]; work[i] = { ...w, endDate: e.target.value }; return { ...prev, work }; })} aria-label="End date (blank if current)" />
              </div>
              {w.highlights.map((h, j) => (
                <input key={j} className={input} placeholder={`What did you achieve? (bullet ${j + 1})`} value={h} onChange={(e) => setP((prev) => { const work = [...prev.work]; const highlights = [...w.highlights]; highlights[j] = e.target.value; work[i] = { ...w, highlights }; return { ...prev, work }; })} />
              ))}
              <button type="button" className="text-sm underline" onClick={() => setP((prev) => { const work = [...prev.work]; work[i] = { ...w, highlights: [...w.highlights, ""] }; return { ...prev, work }; })}>Add bullet</button>
            </div>
          ))}
          <button type="button" className="text-sm font-medium underline" onClick={() => update({ work: [...p.work, { company: "", position: "", startDate: "", endDate: "", highlights: ["", ""] }] })}>Add another role</button>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-4">
          {p.education.map((e, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 rounded-lg border border-[var(--line)] bg-white p-3">
              <input className={`${input} col-span-2`} placeholder="Institution" value={e.institution} onChange={(ev) => setP((prev) => { const education = [...prev.education]; education[i] = { ...e, institution: ev.target.value }; return { ...prev, education }; })} />
              <input className={input} placeholder="Course of study" value={e.area} onChange={(ev) => setP((prev) => { const education = [...prev.education]; education[i] = { ...e, area: ev.target.value }; return { ...prev, education }; })} />
              <select className={input} value={e.studyType} onChange={(ev) => setP((prev) => { const education = [...prev.education]; education[i] = { ...e, studyType: ev.target.value }; return { ...prev, education }; })}>
                {["BSc", "BA", "BEng", "HND", "OND", "NCE", "MSc", "MBA", "PhD", "SSCE"].map((t) => <option key={t}>{t}</option>)}
              </select>
              <input className={input} placeholder="Year" value={e.endDate ?? ""} onChange={(ev) => setP((prev) => { const education = [...prev.education]; education[i] = { ...e, endDate: ev.target.value }; return { ...prev, education }; })} />
              <input className={input} placeholder="Grade (optional)" value={e.grade ?? ""} onChange={(ev) => setP((prev) => { const education = [...prev.education]; education[i] = { ...e, grade: ev.target.value }; return { ...prev, education }; })} />
            </div>
          ))}
          <div><label className={label}>Skills (comma separated)</label><textarea className={input} rows={2} placeholder="Excel, customer service, Canva" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} /></div>
          <div><label className={label}>Certifications (comma separated, optional)</label><input className={input} placeholder="Google Data Analytics, ICAN ATS" value={certsText} onChange={(e) => setCertsText(e.target.value)} /></div>
        </section>
      )}

      <div className="flex justify-between pt-2">
        <button type="button" disabled={step === 0} onClick={() => setStep((s) => s - 1)} className="px-4 py-2 rounded-md border border-[var(--line)] bg-white disabled:opacity-40">Back</button>
        {step < steps.length - 1 ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="px-4 py-2 rounded-md bg-[var(--brand)] text-white font-medium">Next</button>
        ) : (
          <button type="button" onClick={finish} className="px-4 py-2 rounded-md bg-[var(--brand)] text-white font-medium">See my score and matches</button>
        )}
      </div>
    </div>
  );
}
