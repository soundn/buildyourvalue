export function TrustFooter() {
  return (
    <footer className="no-print border-t border-[var(--line)] bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6 text-sm text-[var(--muted)] space-y-2">
        <p className="font-medium text-[var(--ink)]">We never charge you to apply, and no employer on this platform may charge you.</p>
        <p>Every listing is screened for fee requests, fake contact details and brand impersonation before it reaches you. Report anything suspicious and we pull it within one business day.</p>
        <p>
          A SoundTechWorks solution. CAC RC: <span className="font-mono">[pending]</span>. NDPC registration: <span className="font-mono">[pending]</span>. Prototype build; sample listings are fictional.
        </p>
      </div>
    </footer>
  );
}
