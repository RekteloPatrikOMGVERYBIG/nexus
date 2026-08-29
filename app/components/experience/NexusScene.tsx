"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import NexusCore from "./NexusCore";
import OrbitSystem from "./OrbitSystem";
import ParticleField from "./ParticleField";

function CameraRig() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const targetX = state.pointer.x * 0.12;
    const targetY = state.pointer.y * 0.08;

    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const scrollProgress =
      maxScroll > 0
        ? THREE.MathUtils.clamp(
            window.scrollY / maxScroll,
            0,
            1,
          )
        : 0;

    // 01 → 04: Core moves away
    const retreatProgress =
      THREE.MathUtils.smoothstep(
        scrollProgress,
        0.05,
        0.58,
      );

    // 05 → 06: Core comes back
    const returnProgress =
      THREE.MathUtils.smoothstep(
        scrollProgress,
        0.64,
        1.0,
      );

    if (coreRef.current) {
      const hiddenScale =
        THREE.MathUtils.lerp(
          1,
          0.12,
          retreatProgress,
        );

      const coreScale =
        THREE.MathUtils.lerp(
          hiddenScale,
          0.7,
          returnProgress,
        );

      coreRef.current.scale.setScalar(
        coreScale,
      );

      // Strong diagonal movement on 05 → 06
      coreRef.current.position.x =
        THREE.MathUtils.lerp(
          0,
          -1.8,
          returnProgress,
        );

      coreRef.current.position.y =
        THREE.MathUtils.lerp(
          0,
          -1.2,
          returnProgress,
        );

      coreRef.current.position.z =
        THREE.MathUtils.lerp(
          0,
          5.8,
          returnProgress,
        );
    }

    const targetZ =
      THREE.MathUtils.lerp(
        0,
        -3.5,
        scrollProgress,
      );

    groupRef.current.position.z +=
      (targetZ - groupRef.current.position.z) * 0.04;

    const sceneScale =
      THREE.MathUtils.lerp(
        1,
        0.82,
        scrollProgress,
      );

    groupRef.current.scale.setScalar(
      sceneScale,
    );

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
      <group
        ref={coreRef}
        position={[0, 0, -0.08]}
      >
        <NexusCore />
        <OrbitSystem />
      </group>
    </group>
  );
}

function Scene() {

  const cursorLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!cursorLightRef.current) return;

    const targetX = state.pointer.x * 3;
    const targetY = state.pointer.y * 2;
    const targetZ = 2.5;

    cursorLightRef.current.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      0.04,
    );
  });
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
        ref={cursorLightRef}
        intensity={2.5}
        distance={4}
        color="#8dbdff"
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