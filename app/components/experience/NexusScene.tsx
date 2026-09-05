"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import * as THREE from "three";
import NexusCore from "./NexusCore";
import OrbitSystem from "./OrbitSystem";
import ParticleField from "./ParticleField";

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function getMotion() { return window.matchMedia(motionQuery).matches; }
function serverMotion() { return true; }
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
function getVisibility() { return document.visibilityState === "visible"; }
function serverVisibility() { return true; }

function StaticCore() {
  return <div className="static-core" aria-hidden="true"><i /><i /><i /><span /></div>;
}
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <StaticCore /> : this.props.children; }
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    const damping = 1 - Math.exp(-delta * 2);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.16, damping);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, state.pointer.y * 0.12, damping);
  });
  return <>
    <ambientLight intensity={0.55} />
    <directionalLight position={[2, 4, 5]} intensity={4} color="#e9eee7" />
    <pointLight position={[-3, -1, 2]} intensity={16} color="#ff673d" distance={10} />
    <pointLight position={[3, 2, -1]} intensity={8} color="#b4c7d1" distance={8} />
    <group ref={group} rotation={[0.12, 0, -0.15]}><NexusCore /><OrbitSystem /></group>
    <ParticleField />
  </>;
}

export default function NexusScene() {
  const reducedMotion = useSyncExternalStore(subscribeMotion, getMotion, serverMotion);
  const visible = useSyncExternalStore(subscribeVisibility, getVisibility, serverVisibility);
  const root = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "80px" });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div className="nexus-scene" ref={root} aria-hidden="true">
    {reducedMotion ? <StaticCore /> : <SceneBoundary><Canvas
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      dpr={[1, 1.5]} frameloop={visible && inView ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      fallback={<StaticCore />}
    ><Scene /></Canvas></SceneBoundary>}
  </div>;
}
