"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { designProjects } from "@/content/design";
import { useFinePointer } from "@/hooks/useFinePointer";
import { cn } from "@/lib/utils";
import { useDesignScroll } from "./useDesignScroll";
import { Lightbox } from "./Lightbox";
import styles from "./DesignGallery.module.css";

/**
 * three.js is ~200KB gzipped and this section sits well below the fold, so the
 * whole stage is a separate chunk that never touches the initial bundle — the
 * hero's name marquee is the LCP element and that path stays clean.
 */
const Stage = dynamic(() => import("./scene/Stage").then((m) => m.Stage), {
  ssr: false,
});

/** Cheap probe: a context we immediately discard, so nothing is retained. */
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * The design gallery — seventeen pieces as textured planes drifting through a
 * perspective camera, pinned so vertical scroll drives them sideways.
 *
 * **The DOM list is not a decoy.** It is the same markup in both modes: clipped
 * but focusable while the canvas is live, and the visible scroll-snap rail when
 * the canvas never mounts. That is what a screen reader reads, what Google
 * crawls, and what keyboard users tab through — the WebGL field is decoration
 * layered over it, and is `aria-hidden`.
 *
 * Mode is decided after mount (`useFinePointer` reports false on the server and
 * the first client render by design), so the rail is what SSR emits and the
 * scene is pure progressive enhancement.
 */
export function DesignGallery() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();

  const [webgl, setWebgl] = useState(false);
  const [near, setNear] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => setWebgl(supportsWebGL()), []);

  const scene = fine && webgl;

  const { progress, index } = useDesignScroll({
    sectionRef: section,
    stageRef: stage,
    count: designProjects.length,
    enabled: scene,
  });

  // Start the three.js chunk and the seventeen textures before the section
  // arrives, but never while the hero is still animating.
  //
  // Both halves are load-bearing. The section sits about three viewports down,
  // so a rootMargin of 250% fired on page load and pulled 220KB of WebGL plus
  // seventeen textures straight through the hero entrance — measurable jank on
  // the LCP path. A margin alone is not a sufficient guard either, because on a
  // tall window the section is fewer viewports away; waiting for `load` is what
  // makes this safe at any viewport height.
  useEffect(() => {
    const node = section.current;
    if (!scene || !node || near) return;

    let observer: IntersectionObserver | undefined;

    const observe = () => {
      observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), {
        rootMargin: "150% 0px",
      });
      observer.observe(node);
    };

    if (document.readyState === "complete") {
      observe();
    } else {
      window.addEventListener("load", observe, { once: true });
    }

    return () => {
      window.removeEventListener("load", observe);
      observer?.disconnect();
    };
  }, [scene, near]);

  return (
    <section
      id="design"
      ref={section}
      className={styles.section}
      data-mode={scene ? "scene" : "rail"}
    >
      <div ref={stage} className={styles.stage}>
        {scene && near && (
          <div className={styles.canvas}>
            <Stage projects={designProjects} progress={progress} onOpen={setOpen} />
          </div>
        )}

        <div className={styles.chrome}>
          <h2 className={styles.label}>Selected design explorations</h2>

          <div className={styles.foot}>
            <span className={styles.rule} aria-hidden="true">
              <span className={styles.ruleFill} />
            </span>
            <span className={cn(styles.counter, "mono")}>
              {String(index + 1).padStart(2, "0")} / {designProjects.length}
            </span>
          </div>
        </div>

        <ul className={styles.list}>
          {designProjects.map((project, i) => (
            <li key={project.image} className={styles.item}>
              <button
                type="button"
                className={styles.card}
                style={{ aspectRatio: `${project.width} / ${project.height}` }}
                onClick={() => setOpen(i)}
              >
                {/* Only in rail mode. In scene mode these cards are invisible
                    stand-ins for the meshes, and rendering them would fetch a
                    second copy of all seventeen images that nobody ever sees.
                    SSR emits rail mode, so crawlers still get the <img>. */}
                {!scene && (
                  <Image
                    src={project.image}
                    alt=""
                    width={project.width}
                    height={project.height}
                    sizes="(min-width: 48rem) 30vw, 70vw"
                    className={styles.thumb}
                  />
                )}
                <span className={styles.name}>{project.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox
        projects={designProjects}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </section>
  );
}
