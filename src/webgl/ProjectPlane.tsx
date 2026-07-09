"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { lerp } from "@/lib/utils";
import { planeFragmentShader, planeVertexShader } from "./shaders/plane";

const PLANE_W = 7.4;
const PLANE_H = 4.2;

/** Vertical distance between slides, in world units. */
export const SLIDE_GAP = 5.4;

interface ProjectPlaneProps {
  texture: string;
  index: number;
  /** Live carousel position, in slide units. Read per-frame, never via state. */
  progressRef: React.RefObject<number>;
}

export function ProjectPlane({ texture, index, progressRef }: ProjectPlaneProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const map = useTexture(texture);

  // Screenshots are wider than they are tall; keep them from stretching.
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: map },
      uPlaneSize: { value: new THREE.Vector2(PLANE_W / PLANE_H, 1) },
      uRadius: { value: 0.06 },
      uAberration: { value: 0.05 },
      uActive: { value: 0 },
      uOpacity: { value: 1 },
      uCurve: { value: 0.16 },
      uTime: { value: 0 },
    }),
    [map]
  );

  useFrame((_, delta) => {
    if (!mesh.current) return;

    const offset = index - (progressRef.current ?? 0);
    const distance = Math.abs(offset);

    // Stack the slides vertically, receding and tilting away from the centre.
    mesh.current.position.y = -offset * SLIDE_GAP;
    mesh.current.position.z = -distance * 2.6;
    mesh.current.rotation.x = offset * 0.22;
    mesh.current.rotation.z = -0.045;

    const scale = 1 - Math.min(distance, 3) * 0.05;
    mesh.current.scale.setScalar(scale);

    // Active-ness drives colour, brightness, and the rim light in the shader.
    const active = Math.max(0, 1 - distance * 1.15);
    uniforms.uActive.value = lerp(uniforms.uActive.value, active, Math.min(1, delta * 8));

    // Cull far slides rather than paying to blend them.
    uniforms.uOpacity.value = Math.max(0, 1 - Math.max(0, distance - 1.2) * 1.1);
    mesh.current.visible = uniforms.uOpacity.value > 0.01;

    uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[PLANE_W, PLANE_H, 48, 32]} />
      <shaderMaterial
        vertexShader={planeVertexShader}
        fragmentShader={planeFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
