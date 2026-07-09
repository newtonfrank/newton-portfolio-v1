"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/types/content";
import { clamp } from "@/lib/utils";
import { ProjectPlane } from "./ProjectPlane";

interface CarouselProps {
  projects: Project[];
  progressRef: React.RefObject<number>;
}

/**
 * The slides, plus the ambient colour of the scene itself.
 *
 * The background is blended between the two nearest slides' `ambient` colours
 * rather than snapped on slide change, so scrolling reads as moving through a
 * space that is lit differently at each stop.
 */
export function Carousel({ projects, progressRef }: CarouselProps) {
  const scene = useThree((state) => state.scene);
  const target = useRef(new THREE.Color(projects[0].ambient));

  const ambientColors = useMemo(
    () => projects.map((project) => new THREE.Color(project.ambient)),
    [projects]
  );

  const background = useMemo(() => {
    const color = new THREE.Color(projects[0].ambient);
    scene.background = color;
    return color;
  }, [scene, projects]);

  useFrame((_, delta) => {
    const progress = clamp(progressRef.current ?? 0, 0, projects.length - 1);
    const low = Math.floor(progress);
    const high = Math.min(low + 1, projects.length - 1);

    target.current.copy(ambientColors[low]).lerp(ambientColors[high], progress - low);
    background.lerp(target.current, Math.min(1, delta * 3));
  });

  return (
    <group>
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
