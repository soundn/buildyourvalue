export function ScoreRing({ value, label }: { value: number; label: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const color = pct < 45 ? "#c0392b" : pct < 65 ? "#d68910" : pct < 80 ? "#1e8449" : "#0f6b3a";
  return (
    <div className="flex items-center gap-4">
      <svg width="96" height="96" viewBox="0 0 96 96" role="img" aria-label={`${label}: ${pct} out of 100`}>
        <circle cx="48" cy="48" r={r} stroke="#e3e9e5" strokeWidth="10" fill="none" />
        <circle cx="48" cy="48" r={r} stroke={color} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${(pct / 100) * c} ${c}`} transform="rotate(-90 48 48)" />
        <text x="48" y="54" textAnchor="middle" fontSize="22" fontWeight="700" fill="#14211b">{pct}</text>
      </svg>
      <div>
        <div className="text-sm text-[var(--muted)]">{label}</div>
        <div className="text-lg font-semibold capitalize" style={{ color }}>{pct < 45 ? "Weak" : pct < 65 ? "Developing" : pct < 80 ? "Competitive" : "Strong"}</div>
      </div>
    </div>
  );
}
