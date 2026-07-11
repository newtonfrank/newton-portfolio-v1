"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { particlesFragmentShader, particlesVertexShader } from "./shaders/particles";

const SPREAD_XY = 22;
const SPREAD_Z = 14;

interface ParticlesProps {
  /** Scaled down on weak GPUs by the caller. */
  count?: number;
}

/**
 * Atmospheric dust drifting through the scene. A single THREE.Points with a
 * custom material — cheap, and the drift is entirely in the vertex shader.
 */
export function Particles({ count = 340 }: ParticlesProps) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD_XY;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_XY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
      phases[i] = Math.random();
      scales[i] = 0.3 + Math.random() * 0.7;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 6 },
      uPointer: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color("#ecece6") },
    }),
    []
  );

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uPointer.value.lerp(state.pointer, Math.min(1, delta * 2));
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
