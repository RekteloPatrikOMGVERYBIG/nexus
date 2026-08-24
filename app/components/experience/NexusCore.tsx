"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function NexusCore() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;

    if (outerRef.current) {
      outerRef.current.rotation.x += delta * 0.08;
      outerRef.current.rotation.y += delta * 0.13;

      outerRef.current.rotation.x +=
        (pointerY * 0.18 - outerRef.current.rotation.x) * 0.012;

      outerRef.current.rotation.y +=
        (pointerX * 0.25 - outerRef.current.rotation.y) * 0.012;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.16;
      innerRef.current.rotation.y += delta * 0.24;
    }

    if (wireRef.current) {
      wireRef.current.rotation.x -= delta * 0.06;
      wireRef.current.rotation.y -= delta * 0.1;
      wireRef.current.rotation.z += delta * 0.025;
    }
  });

  return (
    <Float
      speed={0.8}
      rotationIntensity={0.12}
      floatIntensity={0.18}
    >
      <mesh ref={outerRef} scale={1.12}>
        <icosahedronGeometry args={[1, 4]} />

        <meshPhysicalMaterial
          color="#0d1a2d"
          roughness={0.24}
          metalness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.16}
          transmission={0.18}
          transparent
          opacity={0.82}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={innerRef} scale={0.5}>
        <icosahedronGeometry args={[1, 3]} />

        <meshPhysicalMaterial
          color="#b9d8ff"
          emissive="#386ca8"
          emissiveIntensity={1.8}
          roughness={0.08}
          metalness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>

      <mesh ref={wireRef} scale={1.28}>
        <icosahedronGeometry args={[1, 2]} />

        <meshBasicMaterial
          color="#8dbdff"
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>

      <pointLight
        color="#a8ccff"
        intensity={3.5}
        distance={4}
        decay={2}
      />
    </Float>
  );
}