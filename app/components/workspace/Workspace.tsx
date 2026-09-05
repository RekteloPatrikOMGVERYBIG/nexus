"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Arrow,
  Brand,
  ModuleIcon,
  NexusMark,
  type ModuleName,
} from "@/app/components/ui/Brand";

const modules: {
  id: ModuleName;
  title: string;
  subtitle: string;
  description: string;
  possibilities: string[];
}[] = [
  {
    id: "code",
    title: "Code",
    subtitle: "Keep your best thinking close.",
    description:
      "A future home for useful snippets, technical notes, and ideas you want to come back to. Your knowledge, with a little more context.",
    possibilities: [
      "Reusable code snippets",
      "Technical notes",
      "Connected knowledge",
    ],
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "Give your next idea a direction.",
    description:
      "A clearer view of the work you’re moving forward. This space will connect the context, decisions, and progress behind your projects.",
    possibilities: [
      "Project overviews",
      "Progress and milestones",
      "Related knowledge",
    ],
  },
  {
    id: "people",
    title: "People",
    subtitle: "Put the people back in the picture.",
    description:
      "A place for the minds behind the work. We’re shaping a way to bring ownership, shared context, and collaboration closer together.",
    possibilities: ["Team connections", "Clear ownership", "Shared context"],
  },
  {
    id: "ai",
    title: "Intelligence",
    subtitle: "Find a different perspective.",
    description:
      "Useful intelligence starts with meaningful context. This space explores how your engineering knowledge can open up new possibilities.",
    possibilities: [
      "Contextual insights",
      "Knowledge discovery",
      "Thoughtful assistance",
    ],
  },
];

export default function NexusPage({ email }: { email: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<ModuleName | "overview">("overview");

  const profileLoading = false;
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const active = modules.find((item) => item.id === selected);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    setError("");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
        signal: AbortSignal.timeout(20000),
      });
      if (!response.ok) throw new Error("Sign out failed");
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("nexus-auth");
        channel.postMessage("logout");
        channel.close();
      }
      router.replace("/nexus/login");
      router.refresh();
    } catch {
      setError("Sign out didn’t complete. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="workspace-app">
      <aside className="workspace-sidebar">
        <Brand />
        <div className="workspace-switch">
          <span className="workspace-avatar">
            <NexusMark />
          </span>
          <div>
            <strong>Personal workspace</strong>
            <small>NEXUS / Early preview</small>
          </div>
        </div>
        <p className="sidebar-label">WORKSPACE</p>
        <nav className="sidebar-nav" aria-label="Workspace navigation">
          <button
            type="button"
            aria-label="Overview"
            className={selected === "overview" ? "active" : ""}
            aria-pressed={selected === "overview"}
            onClick={() => setSelected("overview")}
          >
            <span className="overview-icon">⌘</span>
            <span>Overview</span>
            <span className="nav-active-dot" />
          </button>
          {modules.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-label={item.title}
              className={selected === item.id ? "active" : ""}
              aria-pressed={selected === item.id}
              onClick={() => setSelected(item.id)}
            >
              <ModuleIcon name={item.id} />
              <span>{item.title}</span>
              <span className="nav-active-dot" />
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="signal-dot" />
            <strong>A space taking shape.</strong>
            <p>
              You’re exploring an early version of NEXUS. There’s more on the
              horizon.
            </p>
            <Link href="/#system">
              Explore the vision <Arrow diagonal />
            </Link>
          </div>
          <div className="account-row">
            <span className="account-avatar">
              {email ? email.charAt(0).toUpperCase() : "N"}
            </span>
            <div>
              <strong>Your account</strong>
              <small title={email}>
                {profileLoading
                  ? "Loading account…"
                  : email || "Account unavailable"}
              </small>
            </div>
            <button
              className="signout-icon"
              type="button"
              aria-label={loggingOut ? "Signing out" : "Sign out"}
              title="Sign out"
              disabled={loggingOut}
              onClick={handleLogout}
            >
              {loggingOut ? <span className="loading-spinner" /> : "↗"}
            </button>
          </div>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <span>NEXUS</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{active?.title || "Overview"}</strong>
          </div>
          <span className="preview-badge">
            <span className="signal-dot" /> EARLY PREVIEW
          </span>
        </header>
        <main className="workspace-content" id="main-content">
          <div role="status" aria-live="polite">
            {error && <p className="form-message error">{error}</p>}
          </div>
          <div className="workspace-welcome">
            <p className="eyebrow">YOUR SPACE TO BUILD</p>
            <h1>
              {active ? (
                active.title
              ) : (
                <>
                  Welcome to your <span>orbit.</span>
                </>
              )}
            </h1>
            <p>
              {active
                ? active.subtitle
                : "A little more focus. A lot more possibility. Make yourself at home."}
            </p>
          </div>
          {!active ? (
            <>
              <section className="workspace-banner">
                <div>
                  <span className="eyebrow">
                    INDEPENDENT IDEAS. SHARED GRAVITY.
                  </span>
                  <h2>
                    Everything starts
                    <br />
                    with a connection.
                  </h2>
                  <p>
                    Four dimensions of your work.
                    <br />
                    One space to bring them together.
                  </p>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => setSelected("code")}
                  >
                    Explore the modules <Arrow />
                  </button>
                </div>
                <div className="banner-orbits" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>
                    <NexusMark />
                  </span>
                </div>
                <span className="banner-index">N / 001</span>
              </section>
              <div className="workspace-section-title">
                <h2>
                  Your modules <span>04</span>
                </h2>
                <span>WHAT’S TAKING SHAPE</span>
              </div>
              <div className="module-card-grid">
                {modules.map((item, index) => (
                  <button
                    type="button"
                    className="module-card"
                    key={item.id}
                    onClick={() => setSelected(item.id)}
                  >
                    <div className="module-card-top">
                      <ModuleIcon name={item.id} />
                      <span>0{index + 1}</span>
                    </div>
                    <h3>
                      {item.title}
                      <Arrow diagonal />
                    </h3>
                    <p>{item.subtitle}</p>
                    <span className="development-status">
                      <i /> In development
                    </span>
                  </button>
                ))}
              </div>
              <section className="workspace-bottom-note">
                <span className="note-symbol">✳</span>
                <div>
                  <h3>Room for what comes next.</h3>
                  <p>
                    These modules are a preview of the NEXUS vision. Your first
                    projects and saved ideas will live here as the workspace
                    evolves.
                  </p>
                </div>
                <Link href="/#philosophy" className="text-link">
                  Our philosophy <Arrow diagonal />
                </Link>
              </section>
            </>
          ) : (
            <section className="module-detail" key={active.id}>
              <div className="detail-top">
                <span className="development-status">
                  <i /> In development
                </span>
                <span className="mono">NEXUS / {active.id.toUpperCase()}</span>
              </div>
              <div className="detail-symbol">
                <ModuleIcon name={active.id} />
              </div>
              <h2>A new space is taking shape.</h2>
              <p>{active.description}</p>
              <div className="possibility-tags">
                {active.possibilities.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <p className="detail-note">
                This module is a preview. Saving and collaboration aren’t
                available yet.
              </p>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setSelected("overview")}
              >
                Back to overview <Arrow />
              </button>
            </section>
          )}
          <footer className="workspace-footer">
            <span>BUILT FOR CURIOUS MINDS.</span>
            <span>NEXUS © {new Date().getFullYear()}</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
