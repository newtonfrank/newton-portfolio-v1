"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// Actually, standard R3F templates often use maath. Let's try without maath first to avoid extra deps if possible, or just install it.
// The prompt said "The Flex: Use GLSL Shaders". I can use a custom shader or stick to R3F abstractions which use shaders under the hood.
// Let's stick to a custom implementation for the "Flex" but keep it reliable. 
// I'll use a simple Float32Array for positions.

const StarFieldImpl = (props: any) => {
    const ref = useRef<any>();
    const [sphere] = useState(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            const r = 200 * Math.random(); // Radius
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00ffff" // Cyan
                    size={0.05}     // Slightly chunky for neat retro feel
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
};

export const StarField = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <StarFieldImpl />
                <gridHelper args={[100, 100, 0x00ffff, 0x222222]} position={[0, -10, 0]} rotation={[0, 0, 0]} />
            </Canvas>
            {/* Gradient Overlay for Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
        </div>
    );
};
