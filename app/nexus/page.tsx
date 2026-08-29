"use client";

import Link from "next/link";
import { useState } from "react";

const modules = {
  CODE: {
    number: "01",
    title: "CODE",
    status: "ACTIVE",
    description:
      "Organize engineering logic, source code and technical knowledge in one connected workspace.",
  },
  PROJECTS: {
    number: "02",
    title: "PROJECTS",
    status: "SYNCED",
    description:
      "Track execution, dependencies and progress across every engineering project.",
  },
  PEOPLE: {
    number: "03",
    title: "PEOPLE",
    status: "ONLINE",
    description:
      "Connect the people behind the system with context, ownership and shared intelligence.",
  },
  AI: {
    number: "04",
    title: "AI",
    status: "READY",
    description:
      "Turn engineering knowledge into intelligent actions, recommendations and decisions.",
  },
} as const;

type ModuleName = keyof typeof modules;

export default function NexusPage() {
  const [activeModule, setActiveModule] =
    useState<ModuleName>("CODE");

  const active = modules[activeModule];

  return (
    <main className="nexus-dashboard">
      <header className="nexus-dashboard-header">
        <Link
          href="/"
          className="nexus-dashboard-logo"
        >
          NEXUS<span>®</span>
        </Link>

        <div className="nexus-dashboard-status">
          <span />
          SYSTEM ONLINE
        </div>

        <Link
          href="/"
          className="nexus-dashboard-back"
        >
          EXIT
        </Link>
      </header>

      <section className="nexus-dashboard-hero">
        <div className="nexus-dashboard-intro">
          <p>NEXUS / SYSTEM</p>

          <div className="nexus-dashboard-heading">
            <h1>CONTROL</h1>

            <h2 key={activeModule}>
              <span>THE FLOW.</span>
            </h2>
          </div>

          <p
            className="nexus-dashboard-description"
            key={activeModule}
          >
            {active.description}
          </p>
        </div>

        <div className="nexus-dashboard-grid">
          {(
            Object.keys(modules) as ModuleName[]
          ).map((moduleName) => {
            const module = modules[moduleName];
            const isActive =
              activeModule === moduleName;

            return (
              <button
                key={moduleName}
                type="button"
                className={`nexus-module ${
                  isActive ? "is-active" : ""
                }`}
                onClick={() =>
                  setActiveModule(moduleName)
                }
              >
                <span>{module.number}</span>

                <strong>{module.title}</strong>

                <small>
                  {isActive
                    ? "ACTIVE"
                    : module.status}
                </small>
              </button>
            );
          })}
        </div>

        <div className="nexus-system-visual">
          <div className="nexus-system-ring ring-a" />
          <div className="nexus-system-ring ring-b" />

          <div className="nexus-system-cross cross-x" />
          <div className="nexus-system-cross cross-y" />

          <div
            className={`nexus-system-core core-${activeModule.toLowerCase()}`}
          >
            <span>{active.number}</span>
            <strong>{active.title}</strong>
          </div>

          <div className="nexus-system-orbit orbit-one" />
          <div className="nexus-system-orbit orbit-two" />
        </div>

      </section>

      <footer className="nexus-dashboard-footer">
        <span>NEXUS / 2026</span>
        <span>
          {active.number} / 04 — {active.title}
        </span>
      </footer>
    </main>
  );
}