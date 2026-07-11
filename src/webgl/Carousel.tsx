"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/types/content";
import { clamp } from "@/lib/utils";
import { ProjectPlane } from "./ProjectPlane";
import { Backdrop } from "./Backdrop";

interface CarouselProps {
  projects: Project[];
  progressRef: React.RefObject<number>;
}

/**
 * The slides, the living background, and the camera parallax.
 *
 * The ambient colour is blended between the two nearest slides' `ambient`
 * colours each frame — not snapped on slide change — so scrolling reads as
 * moving through a space that is lit differently at each stop. The Backdrop
 * reads that same colour, so background and planes stay in one palette.
 *
 * The camera drifts toward the pointer (with idle motion baked into the planes
 * themselves), which is most of what makes the scene feel alive rather than a
 * slideshow.
 */
export function Carousel({ projects, progressRef }: CarouselProps) {
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  const ambientColors = useMemo(
    () => projects.map((project) => new THREE.Color(project.ambient)),
    [projects]
  );

  // Shared, live-lerped colour. Backdrop reads it; scene.background mirrors a
  // darkened version as a fallback behind the fullscreen backdrop quad.
  const colorRef = useRef(new THREE.Color(projects[0].ambient));

  const background = useMemo(() => {
    const color = new THREE.Color(projects[0].ambient).multiplyScalar(0.1);
    scene.background = color;
    return color;
  }, [scene, projects]);

  useFrame((state, delta) => {
    const progress = clamp(progressRef.current ?? 0, 0, projects.length - 1);
    const low = Math.floor(progress);
    const high = Math.min(low + 1, projects.length - 1);

    colorRef.current.copy(ambientColors[low]).lerp(ambientColors[high], progress - low);
    background.copy(colorRef.current).multiplyScalar(0.1);

    // Camera eases toward the pointer for whole-scene parallax, with a slow
    // idle orbit so it never comes fully to rest.
    const idle = state.clock.elapsedTime;
    const targetX = state.pointer.x * 0.7 + Math.sin(idle * 0.15) * 0.15;
    const targetY = state.pointer.y * 0.5 + Math.cos(idle * 0.12) * 0.1;
    camera.position.x += (targetX - camera.position.x) * Math.min(1, delta * 2.5);
    camera.position.y += (targetY - camera.position.y) * Math.min(1, delta * 2.5);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      <Backdrop colorRef={colorRef} />
      {projects.map((project, index) => (
        <ProjectPlane
          key={project.title}
          texture={project.texture}
          index={index}
          progressRef={progressRef}
        />
      ))}
    </group>
  );
}
