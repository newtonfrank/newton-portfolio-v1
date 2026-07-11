"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import type { Project } from "@/types/content";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Carousel } from "./Carousel";

interface SceneProps {
  projects: Project[];
  progressRef: React.RefObject<number>;
}

/**
 * The shared canvas. Fixed behind the DOM overlay, pointer-events: none, so all
 * interaction still lands on real HTML controls.
 *
 * `dpr` is capped at 2 and dropped by PerformanceMonitor on weak GPUs.
 * Post-processing is skipped entirely under reduced motion — bloom and film
 * grain are motion, even when nothing is technically moving.
 */
export function Scene({ projects, progressRef }: SceneProps) {
  const reduced = useReducedMotion();
  const [degraded, setDegraded] = useState(false);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      frameloop={reduced ? "demand" : "always"}
    >
      <PerformanceMonitor onDecline={() => setDegraded(true)} />
      <AdaptiveDpr pixelated />

      <Suspense fallback={null}>
        <Carousel
          projects={projects}
          progressRef={progressRef}
          particleCount={degraded ? 120 : 340}
        />
      </Suspense>

      {!reduced && !degraded && (
        <EffectComposer>
          <Bloom intensity={0.6} luminanceThreshold={0.48} luminanceSmoothing={0.35} mipmapBlur />
          <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
          <Vignette offset={0.28} darkness={0.72} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
