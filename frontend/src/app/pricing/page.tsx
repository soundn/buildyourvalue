const tiers = [
  { name: "Free", price: "₦0", period: "", items: ["CV draft and weakness score", "Weekly digest of 5 screened jobs", "One explanation per score component"], cta: "Start free", highlight: false },
  { name: "Finished CV pass", price: "₦1,999", period: "one-off, 7 days", items: ["Unlimited CV tailoring and export", "Daily digest for a week", "Learning path preview"], cta: "Buy a pass", highlight: false },
  { name: "Core", price: "₦1,999", period: "per month", items: ["Digest 3x weekly with fit scores and reasons", "5 tailored CVs per month", "Full learning path and re-match", "Cover letters"], cta: "Subscribe", highlight: true },
  { name: "Remote", price: "₦4,999", period: "per month, or ₦12,999 a quarter", items: ["Everything in Core", "Remote roles abroad, only those that hire in Nigeria, with time-zone overlap shown", "CV in global conventions and unlimited tailoring", "Getting-paid module, WhatsApp digest, mock interview"], cta: "Go Remote", highlight: false, phase2: true },
];

export default function Pricing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simple naira pricing. Cancel any time.</h1>
        <p className="text-[var(--muted)] mt-1">Pay by card, bank transfer or USSD through Paystack. Prices include VAT. Refund within 7 days if it is not for you.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {tiers.map((t) => (
          <div key={t.name} className={`rounded-lg border p-5 bg-white ${t.highlight ? "border-[var(--brand)] ring-2 ring-[var(--brand)]/20" : "border-[var(--line)]"}`}>
            <h2 className="font-semibold">{t.name}</h2>
            <p className="mt-1"><span className="text-2xl font-bold">{t.price}</span> <span className="text-sm text-[var(--muted)]">{t.period}</span></p>
            <ul className="mt-3 text-sm space-y-1">{t.items.map((i) => <li key={i}>• {i}</li>)}</ul>
            <button type="button" disabled className="mt-4 w-full py-2 rounded-md border border-[var(--line)] text-sm text-[var(--muted)]" title={t.phase2 ? "Remote launches in Phase 2" : "Payments are wired in the MVP phase"}>
              {t.cta} {t.phase2 ? "(Phase 2)" : "(checkout coming in MVP)"}
            </button>
          </div>
        ))}
      </div>
      <p className="text-sm text-[var(--muted)]">Employers: featured verified roles and fit-scored shortlists from ₦15,000. Contact SoundTechWorks.</p>
    </div>
  );
}
