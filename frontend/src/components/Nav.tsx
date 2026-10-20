import Link from "next/link";

export function Nav() {
  return (
    <header className="no-print sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[var(--line)]">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[var(--brand)]">
          <span className="inline-block w-7 h-7 rounded-md bg-[var(--brand)]" aria-hidden />
          Build Your Value
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/pricing" className="hover:underline">Pricing</Link>
          <Link href="/onboard" className="px-3 py-1.5 rounded-md bg-[var(--brand)] text-white font-medium">Start free</Link>
        </nav>
      </div>
    </header>
  );
}
