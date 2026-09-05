import Link from "next/link";
import { Brand, NexusMark } from "../ui/Brand";
import type { ReactNode } from "react";
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="auth-page" id="main-content">
      <section className="auth-story" aria-label="Welcome to NEXUS">
        <Brand />
        <div className="auth-art" aria-hidden="true">
          <div className="auth-orbit orbit-a" />
          <div className="auth-orbit orbit-b" />
          <div className="auth-orbit orbit-c" />
          <div className="auth-art-core">
            <NexusMark />
          </div>
          <span className="auth-orbit-label label-code">CODE</span>
          <span className="auth-orbit-label label-people">PEOPLE</span>
          <span className="auth-orbit-label label-projects">PROJECTS</span>
          <span className="auth-orbit-label label-ai">INTELLIGENCE</span>
        </div>
        <div className="auth-story-copy">
          <p className="eyebrow">
            <span className="signal-dot" /> YOUR IDEAS HAVE A HOME HERE
          </p>
          <h2>
            Good things
            <br />
            come <span>together.</span>
          </h2>
          <p>
            A little more clarity.
            <br />A whole world of possibility.
          </p>
        </div>
        <div className="auth-story-footer">
          <span>NEXUS / EARLY PREVIEW</span>
          <span>01 — ∞</span>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-top">
          <Link href="/" className="back-link">
            ← Back to NEXUS
          </Link>
          <span className="mono">YOUR WORKSPACE AWAITS</span>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-symbol">
            <NexusMark />
          </div>
          {children}
        </div>
        <footer className="auth-form-footer">
          <span>© {new Date().getFullYear()} NEXUS</span>
          <span>INDEPENDENT IDEAS. SHARED GRAVITY.</span>
        </footer>
      </section>
    </main>
  );
}
