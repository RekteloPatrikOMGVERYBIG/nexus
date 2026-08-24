"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import NexusCore from "./NexusCore";
import OrbitSystem from "./OrbitSystem";
import ParticleField from "./ParticleField";

function CameraRig() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetX = state.pointer.x * 0.12;
    const targetY = state.pointer.y * 0.08;

    groupRef.current.rotation.y +=
      (targetX - groupRef.current.rotation.y) * 0.018;

    groupRef.current.rotation.x +=
      (targetY - groupRef.current.rotation.x) * 0.018;
  });

  return (
    <group 
      ref={groupRef}
      position={[0.65, 0.18, 0]}
    >
      <NexusCore />
      <OrbitSystem />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.18} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={2}
        color="#b9d6ff"
      />

      <pointLight
        position={[-3, -1, 3]}
        intensity={5}
        distance={7}
        color="#376da9"
      />

      <pointLight
        position={[3, 1, -2]}
        intensity={3}
        distance={6}
        color="#8bbdff"
      />

      <CameraRig />

      <ParticleField />
    </>
  );
}

export default function NexusScene() {
  return (
    <div className="nexus-scene" aria-hidden="true">
      <Canvas
        camera={{
          position: [0, 0, 5.2],
          fov: 38,
        }}
        dpr={[1, 1.6]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}