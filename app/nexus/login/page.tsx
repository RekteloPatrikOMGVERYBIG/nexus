"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Arrow, Brand, NexusMark } from "@/app/components/ui/Brand";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; kind: "success" | "error" } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage(null);
    try {
      const supabase = createClient();
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ kind: "success", text: "Check your inbox. Follow the confirmation link to finish creating your account." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage({ kind: "success", text: "You’re signed in. Opening your workspace…" });
        router.replace("/nexus");
        router.refresh();
      }
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "We couldn’t connect. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return <main className="auth-page" id="main-content">
    <section className="auth-story" aria-label="Welcome to NEXUS"><Brand /><div className="auth-art" aria-hidden="true"><div className="auth-orbit orbit-a" /><div className="auth-orbit orbit-b" /><div className="auth-orbit orbit-c" /><div className="auth-art-core"><NexusMark /></div><span className="auth-orbit-label label-code">CODE</span><span className="auth-orbit-label label-people">PEOPLE</span><span className="auth-orbit-label label-projects">PROJECTS</span><span className="auth-orbit-label label-ai">INTELLIGENCE</span></div><div className="auth-story-copy"><p className="eyebrow"><span className="signal-dot" /> YOUR IDEAS HAVE A HOME HERE</p><h2>Good things<br />come <span>together.</span></h2><p>A little more clarity.<br />A whole world of possibility.</p></div><div className="auth-story-footer"><span>NEXUS / EARLY PREVIEW</span><span>01 — ∞</span></div></section>
    <section className="auth-form-side"><div className="auth-top"><Link href="/" className="back-link">← Back to NEXUS</Link><span className="mono">YOUR WORKSPACE AWAITS</span></div>
      <div className="auth-form-wrap"><div className="auth-symbol"><NexusMark /></div><p className="eyebrow">{isSignUp ? "A NEW BEGINNING" : "BACK IN YOUR ELEMENT"}</p><h1>{isSignUp ? "Make yourself at home." : "Welcome back."}</h1><p className="auth-intro">{isSignUp ? "Create your account and explore the NEXUS workspace." : "Pick up where your next big idea left off."}</p>
        <div className="auth-tabs" aria-label="Account access"><button type="button" aria-pressed={!isSignUp} disabled={loading} className={!isSignUp ? "active" : ""} onClick={() => { setIsSignUp(false); setMessage(null); }}>Sign in</button><button type="button" aria-pressed={isSignUp} disabled={loading} className={isSignUp ? "active" : ""} onClick={() => { setIsSignUp(true); setMessage(null); }}>Create account</button></div>
        <form onSubmit={handleSubmit} aria-busy={loading}><div className="form-field"><label htmlFor="email">Email address</label><input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} /></div><div className="form-field"><label htmlFor="password">Password</label><div className="password-field"><input id="password" type={showPassword ? "text" : "password"} autoComplete={isSignUp ? "new-password" : "current-password"} placeholder={isSignUp ? "Create a password" : "Enter your password"} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={isSignUp ? 6 : undefined} aria-describedby={isSignUp ? "password-help" : undefined} disabled={loading} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? "Hide" : "Show"}</button></div>{isSignUp && <small id="password-help">Use at least 6 characters.</small>}</div>
          <div aria-live="polite" aria-atomic="true">{message && <p className={`form-message ${message.kind}`}>{message.kind === "success" ? "✓ " : "! "}{message.text}</p>}</div>
          <button type="submit" className="button button-primary auth-submit" disabled={loading}>{loading ? <><span className="loading-spinner" /> {isSignUp ? "Creating your account…" : "Signing you in…"}</> : <>{isSignUp ? "Create your account" : "Enter your workspace"}<Arrow /></>}</button>
        </form><p className="auth-note"><span className="small-lock" aria-hidden="true">◇</span> A personal space for your next chapter.</p>
      </div><footer className="auth-form-footer"><span>© {new Date().getFullYear()} NEXUS</span><span>INDEPENDENT IDEAS. SHARED GRAVITY.</span></footer>
    </section>
  </main>;
}
