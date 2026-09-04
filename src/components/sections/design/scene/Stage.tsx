"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import type { DesignProject } from "@/types/content";
import { CardField } from "./CardField";

interface StageProps {
  projects: DesignProject[];
  progress: RefObject<number>;
  onOpen: (index: number) => void;
}

/**
 * The WebGL stage.
 *
 * The canvas is transparent and the scene carries no background, so the section
 * paints its own `--ink` token behind it — the theme flip keeps working and no
 * colour is hard-coded into the renderer, which would put it beyond the reach
 * of the token system.
 *
 * `meshBasicMaterial` throughout means no lights: these are flat artworks, and
 * anything but unlit shading would only dull the ink.
 */
export function Stage({ projects, progress, onOpen }: StageProps) {
  return (
    <Canvas
      // Retina renders at native density; the cap keeps a 3x phone honest.
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 35, position: [0, 0, 10], near: 0.1, far: 100 }}
      // The field is decoration with a DOM equivalent alongside it, so it stays
      // out of the accessibility tree entirely.
      aria-hidden="true"
    >
      <CardField projects={projects} progress={progress} onOpen={onOpen} />
    </Canvas>
  );
}
