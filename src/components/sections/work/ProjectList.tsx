"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/types/content";
import { useFinePointer } from "@/hooks/useFinePointer";
import { duration, ease, lerp as lerpFactors } from "@/lib/motion";
import { cn, lerp } from "@/lib/utils";
import { ProjectRow } from "./ProjectRow";
import styles from "./ProjectList.module.css";

interface ProjectListProps {
  projects: Project[];
}

/**
 * Directional slide for the preview image. Moving *down* the list (a higher
 * index) sends the new frame in from below while the old one leaves through the
 * top; moving *up* reverses it — so the reveal tracks the pointer's travel
 * instead of a flat cross-fade. `custom` carries that direction into the exit.
 */
const slide = {
  enter: (dir: number) => ({ y: dir > 0 ? "100%" : "-100%" }),
  center: { y: "0%" },
  exit: (dir: number) => ({ y: dir > 0 ? "-100%" : "100%" }),
};

/**
 * The signature interaction. Hovering a row dims the others and reveals a
 * preview thumbnail that *eases* toward the pointer via an RAF lerp — so it
 * trails rather than snaps. When the active project changes the image
 * *slides* — up or down depending on which way the pointer moved through the
 * list (see `slide`) — rather than cross-fading. A single follower element
 * holds the stack; `AnimatePresence` swaps the visible frame.
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
  const [display, setDisplay] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const displayRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });

  // Activate a row: set the slide direction from the delta, advance the frame,
  // and mark it active. The first reveal has no prior frame, so it just appears.
  const activate = (index: number) => {
    const prev = displayRef.current;
    if (prev === null) {
      displayRef.current = index;
      setDisplay(index);
    } else if (index !== prev) {
      setDir(index > prev ? 1 : -1);
      displayRef.current = index;
      setDisplay(index);
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
    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      pos.x = lerp(pos.x, target.current.x, lerpFactors.cursor);
      pos.y = lerp(pos.y, target.current.y, lerpFactors.cursor);
      preview.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
    };

    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
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
            <AnimatePresence custom={dir} initial={false}>
              {display !== null && (
                <motion.div
                  key={display}
                  className={styles.previewSlide}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: duration.base, ease: ease.out }}
                >
                  <Image
                    src={projects[display].image}
                    alt=""
                    fill
                    sizes="24rem"
                    className={styles.previewImg}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className={styles.badge}>View ↗</span>
        </div>
      )}
    </section>
  );
}
