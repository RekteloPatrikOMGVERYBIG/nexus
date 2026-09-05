import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "NEXUS — Independent ideas. Shared gravity.", template: "%s — NEXUS" },
  description: "A new space for the way you build. Explore a connected workspace for code, projects, people, and intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>;
}
