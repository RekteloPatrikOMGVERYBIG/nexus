"use client";
import { useEffect, useRef } from "react";
import { createScene } from "./createScene";
export default function NexusScene() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current!;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    const setup = () => {
      dispose?.();
      dispose = undefined;
      container.dataset.ready = "false";
      if (query.matches) return;
      try {
        dispose = createScene(container);
        container.dataset.ready = "true";
      } catch {
        container.querySelector("canvas")?.remove();
      }
    };
    setup();
    query.addEventListener("change", setup);
    return () => {
      query.removeEventListener("change", setup);
      dispose?.();
    };
  }, []);
  return (
    <div className="nexus-scene" ref={root} aria-hidden="true">
      <div className="static-core">
        <i />
        <i />
        <i />
        <span />
      </div>
    </div>
  );
}
