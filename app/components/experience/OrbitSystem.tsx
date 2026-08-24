"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Orbit({
    radius,
    rotation,
    speed,
    opacity,
}: {
    radius: number;
    rotation: [number, number, number];
    speed: number;
    opacity: number;
}) {
    const ref = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (!ref.current) return;

        ref.current.rotation.z += delta * speed;
    });

    return (
        <mesh ref={ref} rotation={rotation}>
            <torusGeometry
                args={[radius, 0.004, 8, 160]}
            />

            <meshBasicMaterial
                color="#9cc5ff"
                transparent
                opacity={opacity}
            />
        </mesh>
    );
}

function Nodes() {
    const groupRef = useRef<THREE.Group>(null);

    const nodes = useMemo(
        () =>
            Array.from({ length: 18 }, (_, index) => {
                const angle =
                    (index / 18) * Math.PI * 2;
                
                const radius =
                    1.65 + Math.sin(index * 2.1) * 0.12;

                return {
                    position: [
                        Math.cos(angle) * radius,
                        Math.sin(angle * 1.7) * 0.3,
                        Math.sin(angle) * radius,
                    ]   as [number, number, number,],
                };
            }),
        [],
    );

    useFrame((state) => {
        if (!groupRef.current) return;

        groupRef.current.rotation.y =
          state.clock.elapsedTime * 0.035;
    });

    return (
        <group ref={groupRef}>
          {nodes.map((node, index) => (
            <mesh key={index} position={node.position}>
              <sphereGeometry args={[0.018, 8, 8]} />

              <meshBasicMaterial
                color="#b8d7ff"
               />
            </mesh>
          ))}
        </group>
    );
}

export default function OrbitSystem() {
    return (
        <group>
            <Orbit
                radius={1.72}
                rotation={[Math.PI / 2.5, 0.2, 0]}
                speed={0.08}
                opacity={0.25}
            />

            <Orbit
                radius={1.95}
                rotation={[1.1, 0.4, 0]}
                speed={-0.045}
                opacity={0.15}
            />

            <Orbit
                radius={2.2}
                rotation={[0.4, 1.2, 0.3]}
                speed={0.025}
                opacity={0.1}
            />

            <Nodes />
        </group>
    );
}

