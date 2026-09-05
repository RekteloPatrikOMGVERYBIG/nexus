"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loginLocation } from "@/lib/auth/policy";

export default function SessionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    let active = true;
    let checking = false;
    const controller = new AbortController();
    async function check() {
      if (checking || document.visibilityState !== "visible") return;
      checking = true;
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(20000),
          ]),
        });
        if (!active) return;
        if (response.status === 401) {
          setUnavailable(true);
          router.replace(
            loginLocation(pathname + window.location.search, "expired"),
          );
          router.refresh();
        } else setUnavailable(!response.ok);
      } catch {
        if (active) setUnavailable(true);
      } finally {
        checking = false;
      }
    }
    const channel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("nexus-auth")
        : null;
    if (channel)
      channel.onmessage = () => {
        void check();
      };
    window.addEventListener("focus", check);
    window.addEventListener("pageshow", check);
    document.addEventListener("visibilitychange", check);
    const interval = setInterval(check, 60000);
    void check();
    return () => {
      active = false;
      controller.abort();
      clearInterval(interval);
      channel?.close();
      window.removeEventListener("focus", check);
      window.removeEventListener("pageshow", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [pathname, router]);
  if (unavailable)
    return (
      <main className="auth-form-wrap">
        <h1>Checking your session</h1>
        <p role="status">
          Your workspace is temporarily hidden. We will retry automatically when
          the connection returns.
        </p>
        <button
          className="button button-primary"
          onClick={() => window.location.reload()}
        >
          Retry now
        </button>
      </main>
    );
  return children;
}
