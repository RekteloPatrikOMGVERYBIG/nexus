"use client";

import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function HeroInterface() {
  const heroRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    const hero = heroRef.current;
    const button = buttonRef.current;
    
    if (!hero || !button) return;

    const heroCopy = hero.querySelector(".hero-copy");
    const heroHeader = hero.querySelector(".nexus-header");
    const heroBottom = hero.querySelectorAll(
      ".hero-bottom-left, .hero-bottom-right, .hero-index"
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const elements = hero.querySelectorAll(
      "[data-reveal]:not(.hero-title)",
    );

    const titleLines = hero.querySelectorAll(
      "[data-title-line]",
    );

    if (!reduceMotion) {
      gsap.set(elements, {
        opacity: 0,
        y: 28,
      });

      gsap.set(titleLines, {
        autoAlpha: 0,
        y: 70,
        rotateX: -18,
        transformOrigin: "50% 100%",
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
          titleLines,
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.35,
            ease: "power4.out",
          },
          "-=0.5",
        )
      
        .to(
          hero.querySelectorAll("[data-reveal]:not(.hero-title)"),
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.1,
          },
          "-=0.2",
        )
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

    const handleScroll = () => {
      if (reduceMotion) return;

      const progress = Math.min(
        window.scrollY / window.innerHeight,
        1,
      );

      gsap.to(heroCopy, {
        opacity: 1 - progress,
        y: progress * -120,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });

      gsap.to(
        [heroHeader, ...heroBottom],
        {
          opacity: 1 - progress,
          y: progress * -50,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        },
      );
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMove,
      );

      window.removeEventListener(
        "scroll",
        handleScroll,
      )

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
          <span data-title-line>INTELLIGENCE</span>
          <span 
            className="outline"
            data-title-line
          >
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
          onClick={() => router.push("/nexus")}
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