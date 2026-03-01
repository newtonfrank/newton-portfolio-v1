"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useSpectrum } from "@/store/useSpectrum";

function MorphingObject() {
    const meshRef = useRef<THREE.Mesh>(null);
    const wireRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Track mouse position for parallax tilt
    React.useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            mousePos.current = {
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2,
            };
        };
        window.addEventListener("mousemove", handleMouse);
        return () => window.removeEventListener("mousemove", handleMouse);
    }, []);

    // Morph colors based on spectrum
    const devColor = useMemo(() => new THREE.Color("#00f3ff"), []);
    const designColor = useMemo(() => new THREE.Color("#e85d04"), []);
    const nexusColor = useMemo(() => new THREE.Color("#a040e8"), []);

    useFrame((state) => {
        if (!meshRef.current || !wireRef.current) return;

        // Read position directly from store (no re-render)
        const pos = useSpectrum.getState().position;
        const t = state.clock.elapsedTime;

        // Slow rotation
        meshRef.current.rotation.y = t * 0.15 + mousePos.current.x * 0.3;
        meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1 + mousePos.current.y * 0.2;

        wireRef.current.rotation.y = meshRef.current.rotation.y;
        wireRef.current.rotation.x = meshRef.current.rotation.x;

        // Wireframe opacity: 1 at dev (0), 0 at design (1)
        const wireMat = wireRef.current.material as THREE.MeshBasicMaterial;
        wireMat.opacity = 1 - pos;

        // Solid opacity: 0 at dev (0), 1 at design (1)  
        const solidMat = meshRef.current.material as any;
        if (solidMat.opacity !== undefined) {
            solidMat.opacity = pos;
        }

        // Color morph
        const currentColor = new THREE.Color();
        if (pos < 0.5) {
            currentColor.lerpColors(devColor, nexusColor, pos * 2);
        } else {
            currentColor.lerpColors(nexusColor, designColor, (pos - 0.5) * 2);
        }
        wireMat.color.copy(currentColor);

        // Glow shell — pulsing halo around the object
        if (glowRef.current) {
            const glowMat = glowRef.current.material as THREE.MeshBasicMaterial;
            glowMat.color.copy(currentColor);
            glowMat.opacity = 0.06 + Math.sin(t * 1.5) * 0.03;
            glowRef.current.rotation.y = meshRef.current.rotation.y;
            glowRef.current.rotation.x = meshRef.current.rotation.x;
            glowRef.current.scale.setScalar(1.25 + Math.sin(t * 2) * 0.05);
        }
    });

    const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.8, 1), []);

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <group>
                {/* Solid mesh - visible in design mode */}
                <mesh ref={meshRef} geometry={geometry}>
                    <MeshDistortMaterial
                        color="#e85d04"
                        speed={2}
                        distort={0.3}
                        radius={1}
                        transparent
                        opacity={0.5}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </mesh>

                {/* Wireframe mesh - visible in dev mode */}
                <mesh ref={wireRef} geometry={geometry}>
                    <meshBasicMaterial
                        color="#00f3ff"
                        wireframe
                        transparent
                        opacity={0.5}
                    />
                </mesh>

                {/* Outer glow shell — pulsing halo, additive blending */}
                <mesh ref={glowRef} geometry={geometry}>
                    <meshBasicMaterial
                        color="#a040e8"
                        transparent
                        opacity={0.06}
                        side={THREE.BackSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>

                {/* Second softer glow layer */}
                <mesh scale={1.4}>
                    <icosahedronGeometry args={[1.8, 1]} />
                    <meshBasicMaterial
                        color="#a040e8"
                        transparent
                        opacity={0.02}
                        side={THREE.BackSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            </group>
        </Float>
    );
}

function Particles() {
    const pointsRef = useRef<THREE.Points>(null);

    const particleCount = 200;
    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        const vel = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
            vel[i * 3] = (Math.random() - 0.5) * 0.002;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
        }
        return [pos, vel];
    }, []);

    const devColor = useMemo(() => new THREE.Color("#00f3ff"), []);
    const designColor = useMemo(() => new THREE.Color("#e85d04"), []);

    useFrame(() => {
        if (!pointsRef.current) return;
        const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
            posArr[i * 3] += velocities[i * 3];
            posArr[i * 3 + 1] += velocities[i * 3 + 1];
            posArr[i * 3 + 2] += velocities[i * 3 + 2];

            // Wrap around boundaries
            if (Math.abs(posArr[i * 3]) > 5) velocities[i * 3] *= -1;
            if (Math.abs(posArr[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1;
            if (Math.abs(posArr[i * 3 + 2]) > 2.5) velocities[i * 3 + 2] *= -1;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Color morph (read from store directly)
        const pos = useSpectrum.getState().position;
        const mat = pointsRef.current.material as THREE.PointsMaterial;
        mat.color.lerpColors(devColor, designColor, pos);
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
                size={0.025}
                sizeAttenuation
                transparent
                opacity={0.7}
                color="#00f3ff"
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}

export function HeroCanvas() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 6], fov: 50 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={0.8} color="#e85d04" />
                <pointLight position={[-5, -3, 3]} intensity={0.5} color="#00f3ff" />
                <pointLight position={[0, 3, -5]} intensity={0.3} color="#a040e8" />
                <MorphingObject />
                <Particles />
            </Canvas>
        </div>
    );
}
