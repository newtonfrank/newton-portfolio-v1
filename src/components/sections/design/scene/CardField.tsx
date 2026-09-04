"use client";

import { Suspense, useMemo, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import type { DesignProject } from "@/types/content";
import { layoutField } from "../layout";
import { Card } from "./Card";

interface CardFieldProps {
  projects: DesignProject[];
  progress: RefObject<number>;
  onOpen: (index: number) => void;
}

/** World-unit breathing room before the first card and after the last. */
const PAD = 1.5;

/**
 * Places the field and works out how far it has to travel.
 *
 * Travel is derived from the viewport in *world* units rather than pixels, so a
 * wide monitor sees more of the field at once and scrolls proportionally less —
 * the same field, not a stretched one.
 */
export function CardField({ projects, progress, onOpen }: CardFieldProps) {
  const viewport = useThree((state) => state.viewport);

  const { cards, span } = useMemo(() => layoutField(projects), [projects]);

  const travel = Math.max(0, span + PAD * 2 - viewport.width);
  const originX = -viewport.width / 2 + PAD;

  return (
    <>
      {projects.map((project, index) => (
        // A boundary per card, not one around the field: a single shared
        // boundary makes all seventeen textures block on the slowest one, and
        // the stage sits empty until every last poster has decoded.
        <Suspense key={project.image} fallback={null}>
          <Card
            project={project}
            placement={cards[index]}
            progress={progress}
            travel={travel}
            originX={originX}
            onOpen={() => onOpen(index)}
          />
        </Suspense>
      ))}
    </>
  );
}
