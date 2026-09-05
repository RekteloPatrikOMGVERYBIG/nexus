"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Arrow, Brand } from "../ui/Brand";
import NexusScene from "../experience/NexusScene";

export default function HeroInterface() {
  const [menuOpen, setMenuOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from("[data-hero-reveal]", { y: 32, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", clearProps: "all" });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return <section className="hero" ref={root} id="top">
    <header className="site-header">
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#workspace">Workspace</a><a href="#system">The system</a><a href="#philosophy">Our philosophy</a></nav>
      <div className="header-actions"><Link className="header-login" href="/nexus/login">Sign in <Arrow diagonal /></Link><button ref={menuButton} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button></div>
    </header>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen} onKeyDown={(event) => { if (event.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }}>
      {[['#workspace', 'Workspace'], ['#system', 'The system'], ['#philosophy', 'Our philosophy']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<Arrow /></a>)}
    </nav>
    <div className="hero-main content-width">
      <div className="hero-copy">
        <div className="eyebrow" data-hero-reveal><span className="signal-dot" /> ENGINEERING, IN A NEW ORBIT</div>
        <h1 data-hero-reveal>Big ideas.<br />Better <span className="hero-word">connected<span className="orange-dot">.</span></span></h1>
        <p className="hero-description" data-hero-reveal>A new space for the way you build.<br className="desktop-break" /> Bring code, projects, people, and intelligence into one connected world.</p>
        <div className="hero-actions" data-hero-reveal><Link className="button button-primary" href="/nexus">Enter NEXUS <Arrow diagonal /></Link><a className="text-link" href="#workspace">Explore the workspace <Arrow /></a></div>
        <div className="hero-footnote" data-hero-reveal><span className="tiny-cross">+</span> MADE FOR CURIOUS MINDS. BUILT FOR WHAT’S NEXT.</div>
      </div>
      <div className="hero-art" aria-label="Animated NEXUS core illustration" role="img">
        <div className="orb-coordinate coordinate-top">FIG. 001 <span>THE CONNECTED CORE</span></div>
        <div className="orb-reticle" aria-hidden="true" /><NexusScene />
        <div className="orb-tag orb-tag-code"><span className="tag-dot" /> CODE <span>01</span></div>
        <div className="orb-tag orb-tag-ai"><span className="tag-dot" /> INTELLIGENCE <span>04</span></div>
        <div className="orb-coordinate coordinate-bottom"><span>INDEPENDENT IDEAS.</span> SHARED GRAVITY.</div>
      </div>
    </div>
    <div className="hero-bottom content-width"><a href="#workspace" className="scroll-link"><span className="scroll-track" /> SCROLL TO DISCOVER</a><span>FOUR DIMENSIONS. ONE WORKSPACE.</span><span className="edition">NEXUS / EARLY PREVIEW</span></div>
  </section>;
}
