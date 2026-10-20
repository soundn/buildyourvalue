import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "BYV Admin", description: "Build Your Value admin console. Listing review and employer verification." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        <header className="bg-[#14211b] text-white">
          <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between text-sm">
            <span className="font-semibold">Build Your Value · Admin</span>
            <span className="opacity-70">SoundTechWorks staff only · prototype, no auth</span>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
