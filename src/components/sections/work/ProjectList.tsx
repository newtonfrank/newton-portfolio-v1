"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/types/content";
import { useFinePointer } from "@/hooks/useFinePointer";
import { lerp as lerpFactors } from "@/lib/motion";
import { cn, lerp } from "@/lib/utils";
import { ProjectRow } from "./ProjectRow";
import styles from "./ProjectList.module.css";

interface ProjectListProps {
  projects: Project[];
}

/**
 * One frame in the preview stack. `key` is a monotonic id rather than the
 * project index, so re-entering the same row after leaving still animates.
 */
interface Frame {
  index: number;
  /** 1 = travelling down the list, -1 = up, 0 = first reveal (no slide). */
  dir: number;
  key: number;
}

/**
 * The signature interaction. Hovering a row dims the others and reveals a
 * preview thumbnail that *eases* toward the pointer via an RAF lerp — so it
 * trails rather than snaps. When the active project changes the image
 * *slides* — up or down depending on which way the pointer moved through the
 * list — rather than cross-fading.
 *
 * The slide is two CSS-animated frames, not a JS animation library: the
 * incoming frame is held in `frame` and the outgoing one in `leaving` until it
 * reports `animationend`. Direction rides on data attributes that pick the
 * keyframes (see `.previewSlide` in the module).
 *
 * Coarse pointer / reduced motion (`useFinePointer` === false): no follower,
 * no cursor suppression — each row just carries a static inline thumbnail and
 * stays a plain, tappable link.
 */
export function ProjectList({ projects }: ProjectListProps) {
  const fine = useFinePointer();
  const [active, setActive] = useState<number | null>(null);
  // The frame currently on screen. Distinct from `active` so leaving the list
  // (active → null) fades the follower out without sliding the image away.
  const [frame, setFrame] = useState<Frame | null>(null);
  const [leaving, setLeaving] = useState<Frame | null>(null);
  const frameRef = useRef<Frame | null>(null);
  const seq = useRef(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });

  // Activate a row: set the slide direction from the delta, advance the frame,
  // and mark it active. The first reveal has no prior frame, so it just appears.
  const activate = (index: number) => {
    const prev = frameRef.current;
    if (!prev || prev.index !== index) {
      const next = { index, dir: prev ? (index > prev.index ? 1 : -1) : 0, key: ++seq.current };
      if (prev) setLeaving({ ...prev, dir: next.dir });
      frameRef.current = next;
      setFrame(next);
    }
    setActive(index);
  };

  // Ease the follower toward the live pointer position, every frame.
  useEffect(() => {
    if (!fine) return;
    const preview = previewRef.current;
    if (!preview) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    target.current = { ...pos };
    let raf = 0;

    const render = () => {
      raf = requestAnimationFrame(render);
      pos.x = lerp(pos.x, target.current.x, lerpFactors.cursor);
      pos.y = lerp(pos.y, target.current.y, lerpFactors.cursor);
      preview.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [fine]);

  const onMove = (e: React.PointerEvent) => {
    target.current.x = e.clientX;
    target.current.y = e.clientY;
  };

  return (
    <section id="work" className={styles.section}>
      <p className={cn(styles.eyebrow, "mono")}>Selected work</p>

      <ul
        className={styles.list}
        data-cursor={fine && active !== null ? "none" : undefined}
        onPointerMove={fine ? onMove : undefined}
        onPointerLeave={fine ? () => setActive(null) : undefined}
      >
        {projects.map((project, index) => (
          <ProjectRow
            key={project.title}
            project={project}
            index={index}
            active={active}
            fine={fine}
            onActivate={activate}
          >
            {!fine && (
              <span className={styles.thumb}>
                <Image src={project.image} alt="" fill sizes="72px" className={styles.thumbImg} />
              </span>
            )}
          </ProjectRow>
        ))}
      </ul>

      {fine && (
        <div
          ref={previewRef}
          className={cn(styles.preview, active !== null && styles.previewOn)}
          aria-hidden="true"
        >
          <div className={styles.previewFrame}>
            {leaving && (
              <div
                key={leaving.key}
                className={styles.previewSlide}
                data-exit={leaving.dir > 0 ? "up" : "down"}
                onAnimationEnd={() => setLeaving(null)}
              >
                <Image
                  src={projects[leaving.index].image}
                  alt=""
                  fill
                  sizes="24rem"
                  className={styles.previewImg}
                />
              </div>
            )}
            {frame && (
              <div
                key={frame.key}
                className={styles.previewSlide}
                data-enter={frame.dir === 0 ? "still" : frame.dir > 0 ? "up" : "down"}
              >
                <Image
                  src={projects[frame.index].image}
                  alt=""
                  fill
                  sizes="24rem"
                  className={styles.previewImg}
                />
              </div>
            )}
          </div>
          <span className={styles.badge}>View ↗</span>
        </div>
      )}
    </section>
  );
}
