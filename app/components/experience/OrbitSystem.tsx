"use client";

import { Trail } from "@react-three/drei";
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
    const nodeRefs = useRef<THREE.Mesh[]>([]);

    const nodes = useMemo(
        () =>
            Array.from({ length: 18 }, (_, index) => {
                const angle =
                    (index / 18) * Math.PI * 2;
                
                const radius =
                    1.65 + Math.sin(index * 2.1) * 0.12;

                return {
                    angle,
                    radius,
                    speed: 0.8 + (index % 5) * 0.12,
                    height: Math.sin(angle * 1.7) * 0.3,
                };
            }),
        [],
    );

    useFrame((state) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;

        groupRef.current.rotation.y =
          state.clock.elapsedTime * 0.035 +
          state.pointer.x * 0.08;

        groupRef.current.rotation.x =
            Math.sin(time * 0.35) * 0.025 +
            state.pointer.y * 0.035;

        nodes.forEach((node, index) => {
            const mesh = nodeRefs.current[index];

            if (!mesh) return;

            const angle =
                node.angle +
                time * node.speed * 0.035;

            mesh.position.x =
                Math.cos(angle) * node.radius;

            mesh.position.y =
                Math.sin(angle * 1.7) *
                    0.3 +
                Math.sin(time * 0.8 + index) *
                    0.025;

            mesh.position.z =
                Math.sin(angle) * node.radius;
        })
    });

    return (
        <group ref={groupRef}>
          {nodes.map((node, index) => (
            <Trail
                key={index}
                width={0.35}
                length={3}
                color="#8dbdff"
                attenuation={(t) => t * t}
            >
                <mesh 
                    ref={(mesh) => {
                        if (mesh) {
                            nodeRefs.current[index] = mesh;
                        }
                    }}
                    position={[0, 0, 0]}
                >
                    <sphereGeometry args={[
                        0.012 + (index % 4) * 0.006, 
                        8, 
                        8,
                    ]}
                />

                    <meshBasicMaterial color="#d8eaff" />
                </mesh>
            </Trail>
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

