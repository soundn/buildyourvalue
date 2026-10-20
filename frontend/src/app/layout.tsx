import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { TrustFooter } from "@/components/TrustFooter";

export const metadata: Metadata = {
  title: "Build Your Value",
  description: "AI-assisted CV, verified job matches and a learning path for Nigerian job seekers. A SoundTechWorks solution.",
  applicationName: "Build Your Value",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Build Your Value", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#0f6b3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="min-h-dvh flex flex-col">
        <Nav />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">{children}</main>
        <TrustFooter />
      </body>
    </html>
  );
}
