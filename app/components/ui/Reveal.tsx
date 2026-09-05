"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const media = gsap.matchMedia();
    let observer: IntersectionObserver | undefined;
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(element, { opacity: 0, y: 28 });
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(element, { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" });
          observer?.disconnect();
        }
      }, { threshold: 0.08 });
      observer.observe(element);
      return () => { observer?.disconnect(); gsap.killTweensOf(element); };
    });
    return () => { observer?.disconnect(); media.revert(); };
  }, []);
  return <div className={className} ref={ref}>{children}</div>;
}
