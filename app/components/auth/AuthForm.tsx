"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Arrow } from "../ui/Brand";

export type AuthMode = "login" | "signup" | "recover" | "reset" | "resend";
const titles = {
  login: "Welcome back.",
  signup: "Make yourself at home.",
  recover: "Find your way back.",
  reset: "A fresh start.",
  resend: "Check your inbox.",
};
const labels = {
  login: "Enter your workspace",
  signup: "Create your account",
  recover: "Send recovery email",
  reset: "Set new password",
  resend: "Resend confirmation",
};
const notices: Record<string, string> = {
  confirmed: "Email confirmed. You can now sign in.",
  expired: "Your session has expired. Please sign in again.",
  unconfirmed: "Confirm your email before signing in.",
  "invalid-link":
    "This email link is invalid or expired. Request a fresh link below.",
  unavailable:
    "The authentication service is temporarily unavailable. Please retry.",
};
export default function AuthForm({
  mode,
  next = "/nexus",
  reason = "",
}: {
  mode: AuthMode;
  next?: string;
  reason?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(notices[reason] || "");
  const [failed, setFailed] = useState(reason !== "confirmed");
  const [complete, setComplete] = useState(false);
  const hasPassword = ["login", "signup", "reset"].includes(mode);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (
      mode !== "login" &&
      hasPassword &&
      values.password !== values.confirmPassword
    ) {
      setFailed(true);
      setMessage("The passwords do not match.");
      return;
    }
    setLoading(true);
    setMessage("");
    setFailed(false);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, next }),
        signal: AbortSignal.timeout(45000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      if (mode === "login") {
        const session = await fetch("/api/auth/session", {
          cache: "no-store",
          signal: AbortSignal.timeout(20000),
        });
        if (!session.ok)
          throw new Error(
            "Your session could not be confirmed. Allow cookies for this site and try again.",
          );
        router.replace(result.next);
        router.refresh();
      } else {
        setComplete(true);
        form.reset();
      }
      setMessage(result.message);
    } catch (error) {
      setFailed(true);
      setMessage(
        error instanceof Error && error.name === "Error"
          ? error.message
          : "Connection interrupted. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <p className="eyebrow">YOUR NEXUS ACCOUNT</p>
      <h1>{titles[mode]}</h1>
      <p className="auth-intro">
        {mode === "recover" || mode === "resend"
          ? "Enter your email and we will send you the next step."
          : mode === "reset"
            ? "Choose a unique password of 8–128 characters."
            : "A personal space for your next chapter."}
      </p>
      {!complete && (
        <form onSubmit={submit} aria-busy={loading}>
          {mode !== "reset" && (
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                disabled={loading}
                placeholder="you@example.com"
              />
            </div>
          )}
          {hasPassword && (
            <div className="form-field">
              <label htmlFor="password">
                {mode === "reset" ? "New password" : "Password"}
              </label>
              <div className="password-field">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  minLength={mode === "login" ? 1 : 8}
                  maxLength={128}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}
          {hasPassword && mode !== "login" && (
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                maxLength={128}
                required
                disabled={loading}
              />
            </div>
          )}
          <button
            className="button button-primary auth-submit"
            disabled={loading}
            type="submit"
          >
            {loading ? "Please wait…" : labels[mode]}
            <Arrow />
          </button>
        </form>
      )}
      <div aria-live="polite" aria-atomic="true">
        {message && (
          <p className={`form-message ${failed ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </div>
      <nav className="auth-note auth-links" aria-label="Account options">
        <Link href={`/nexus/login?next=${encodeURIComponent(next)}`}>
          Sign in
        </Link>
        <Link href={`/nexus/signup?next=${encodeURIComponent(next)}`}>
          Create account
        </Link>
        <Link href="/nexus/forgot-password">Forgot password?</Link>
        <Link href="/nexus/login?mode=resend">Resend confirmation</Link>
      </nav>
    </>
  );
}
