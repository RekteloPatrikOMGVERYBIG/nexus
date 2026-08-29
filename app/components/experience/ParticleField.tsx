"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 1800;

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const data = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      const randomA = seededRandom(i + 1);
      const randomB = seededRandom(i + 10001);
      const randomC = seededRandom(i + 20001);

      const radius = 2.2 + randomA * 4.5;
      const theta = randomB * Math.PI * 2;
      const phi = Math.acos(2 * randomC - 1);

      data[i3] =
        radius * Math.sin(phi) * Math.cos(theta);

      data[i3 + 1] =
        radius * Math.sin(phi) * Math.sin(theta);

      data[i3 + 2] =
        radius * Math.cos(phi);
    }

    return data;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const targetX = state.pointer.x * 0.12;
    const targetY = state.pointer.y * 0.08;
    const targetRotationY = state.pointer.x * 0.035;
    const targetRotationX = state.pointer.y * 0.02;

    pointsRef.current.position.x +=
      (targetX - pointsRef.current.position.x) * 0.02;

    pointsRef.current.position.y +=
      (targetY - pointsRef.current.position.y) * 0.02;

    pointsRef.current.rotation.y +=
      (targetRotationY - pointsRef.current.rotation.y) * 0.025;

    pointsRef.current.rotation.x +=
      (targetRotationX - pointsRef.current.rotation.x) * 0.025;

    pointsRef.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#8fbaff"
        size={0.012}
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}