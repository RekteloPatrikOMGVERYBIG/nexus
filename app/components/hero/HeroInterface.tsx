"use client";

import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function HeroInterface() {
  const heroRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const button = buttonRef.current;

    if (!hero || !button) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const elements = hero.querySelectorAll(
      "[data-reveal]",
    );

    if (!reduceMotion) {
      gsap.set(elements, {
        opacity: 0,
        y: 28,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      timeline
        .to(
          hero.querySelector("[data-logo]"),
          {
            opacity: 1,
            duration: 0.8,
          },
        )
        .to(
          hero.querySelector("[data-status]"),
          {
            opacity: 1,
            duration: 0.6,
          },
          "-=0.45",
        )
        .to(
          hero.querySelectorAll("[data-reveal]"),
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.1,
          },
          "-=0.2",
        );
    }

    const handleMove = (event: MouseEvent) => {
      const rect = button.getBoundingClientRect();

      const x =
        event.clientX -
        (rect.left + rect.width / 2);

      const y =
        event.clientY -
        (rect.top + rect.height / 2);

      const distance = Math.sqrt(x * x + y * y);

      if (distance < 130) {
        gsap.to(button, {
          x: x * 0.18,
          y: y * 0.18,
          duration: 0.45,
          ease: "power3.out",
        });
      } else {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.4)",
        });
      }
    };

    const resetButton = () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
      });
    };

    window.addEventListener(
      "mousemove",
      handleMove,
    );

    button.addEventListener(
      "mouseleave",
      resetButton,
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove,
      );

      button.removeEventListener(
        "mouseleave",
        resetButton,
      );

      gsap.killTweensOf(button);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero-layer"
    >
      <header className="nexus-header">
       <Link
          href="/"
          className="nexus-logo"
          data-logo
        >
          NEXUS<span>®</span>
        </Link>

        <div
          className="nexus-status"
          data-status
        >
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>

        <button
          className="menu-button"
          type="button"
          aria-label="Open navigation"
        >
          <span />
          <span />
        </button>
      </header>

      <div className="hero-copy">
        <p
          className="hero-eyebrow"
          data-reveal
        >
          INTELLIGENCE / 01
        </p>

        <h1
          className="hero-title"
          data-reveal
        >
          <span>INTELLIGENCE</span>
          <span className="outline">
            IN MOTION
          </span>
        </h1>

        <p
          className="hero-description"
          data-reveal
        >
          The operating system for intelligent teams.
          <br />
          Connect ideas, people, data and AI.
        </p>

        <button
          ref={buttonRef}
          type="button"
          className="hero-cta"
          data-reveal
        >
          <span>ENTER NEXUS</span>

          <span className="cta-arrow">
            ↗
          </span>
        </button>
      </div>

      <div className="hero-bottom-left">
        <span>SCROLL TO EXPLORE</span>
        <span className="scroll-line" />
      </div>

      <div className="hero-bottom-right">
        <span>AI / 01</span>
        <span>CORE ACTIVE</span>
      </div>

      <div className="hero-index">
        <strong>01</strong>
        <span>/</span>
        <span>06</span>
      </div>
    </section>
  );
}