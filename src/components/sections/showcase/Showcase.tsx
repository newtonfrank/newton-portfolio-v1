"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Project } from "@/types/content";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { duration, gsapEase, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ScrollWaveform } from "./ScrollWaveform";
import styles from "./Showcase.module.css";

const Scene = dynamic(() => import("@/webgl/Scene").then((m) => m.Scene), { ssr: false });

/** Cheap, cached WebGL2 capability probe. */
function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

interface ShowcaseProps {
  projects: Project[];
}

/**
 * Scroll-driven WebGL carousel. The canvas is decorative and `pointer-events:
 * none`; every headline, tagline, and link below is real DOM, so the section is
 * readable, selectable, and keyboard-operable with the canvas switched off.
 *
 * Falls back to a static grid when WebGL is unavailable or the user has asked
 * for reduced motion — a scroll-hijacked 3D carousel is precisely the thing
 * `prefers-reduced-motion` exists to prevent.
 */
export function Showcase({ projects }: ShowcaseProps) {
  const reduced = useReducedMotion();
  const [supported, setSupported] = useState<boolean | null>(null);
  const { sectionRef, progressRef, activeIndex } = useScrollProgress(projects.length);

  useEffect(() => {
    setSupported(detectWebgl());
  }, []);

  // Reveal the headline + tagline whenever the active slide changes. GSAP is
  // already loaded on this route (SmoothScroll, Reveal), so this adds no bundle
  // weight — using framer-motion here pushed First Load over the 180 kB budget.
  // Declared before any early return so hook order stays stable; the effect
  // no-ops on the fallback path, where overlayRef never attaches.
  const overlayRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced || !overlayRef.current) return;
      registerGsap();
      const lines = overlayRef.current.querySelectorAll(`.${styles.line}`);
      gsap.fromTo(
        lines,
        { yPercent: 110 },
        { yPercent: 0, duration: duration.base, ease: gsapEase.out, stagger: stagger.tight }
      );
      gsap.fromTo(
        overlayRef.current.querySelector(`.${styles.tagline}`),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: duration.base, ease: gsapEase.out, delay: 0.08 }
      );
    },
    { dependencies: [activeIndex, reduced], scope: overlayRef }
  );

  // `null` means we have not probed yet — render nothing 3D during that frame
  // rather than mounting a canvas we may immediately tear down.
  const useCanvas = supported === true && !reduced;

  if (supported !== null && !useCanvas) {
    return (
      <section id="work" className={styles.fallback}>
        {projects.map((project) => (
          <article key={project.title} className={styles.fallbackCard}>
            <Image
              src={project.texture}
              alt={project.title}
              width={1600}
              height={900}
              sizes="(min-width: 64rem) 60vw, 100vw"
              className={styles.fallbackImage}
            />
            <div className={styles.fallbackBody}>
              <h3 className={styles.fallbackTitle}>{project.displayTitle.join(" ")}</h3>
              <p className={cn(styles.fallbackTagline, "body")}>{project.tagline}</p>
            </div>
          </article>
        ))}
      </section>
    );
  }

  const active = projects[Math.min(activeIndex, projects.length - 1)];

  return (
    <section
      id="work"
      ref={sectionRef}
      className={styles.section}
      style={{ ["--slide-count" as string]: projects.length }}
    >
      <div className={styles.sticky}>
        {useCanvas && <Scene projects={projects} progressRef={progressRef} />}

        <div className={styles.overlay} ref={overlayRef}>
          <h2 className={styles.headline}>
            {active.displayTitle.map((line) => (
              <span key={line} className={styles.lineMask}>
                <span className={styles.line}>{line}</span>
              </span>
            ))}
          </h2>

          <p className={cn(styles.tagline, "bodyL")}>{active.tagline}</p>

          <div className={styles.actions}>
            {active.href ? (
              <a href={active.href} target="_blank" rel="noreferrer" className={styles.pill}>
                Open
              </a>
            ) : (
              <span className={styles.pill}>Case study soon</span>
            )}
          </div>
        </div>

        <ScrollWaveform
          slideCount={projects.length}
          progressRef={progressRef}
          sectionRef={sectionRef}
        />
      </div>
    </section>
  );
}
