"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { DesignProject } from "@/types/content";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import styles from "./Lightbox.module.css";

interface LightboxProps {
  projects: DesignProject[];
  /** Index of the open piece, or null when closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

/**
 * The piece at full size — the reason the gallery earns its place, since the
 * card field can show these posters but never make their type readable.
 *
 * Built on native `<dialog>`: the focus trap, the backdrop and Esc-to-close all
 * come from the platform rather than from us. Scroll is frozen through
 * `lib/lenis`, the same lock the menu overlay uses, because Lenis drives scroll
 * position from its own RAF loop and `overflow: hidden` alone would not stop it.
 */
export function Lightbox({ projects, index, onClose, onNavigate }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = index !== null;
  const project = index === null ? null : projects[index];

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + projects.length) % projects.length);
    },
    [index, projects.length, onNavigate]
  );

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;

    if (open && !node.open) {
      opener.current = document.activeElement as HTMLElement | null;
      node.showModal();
      lockScroll();
    } else if (!open && node.open) {
      node.close();
    }
  }, [open]);

  // `<dialog>` restores focus on its own in current browsers, but not reliably
  // when the opener was re-rendered underneath it — so put it back explicitly.
  const handleClose = useCallback(() => {
    unlockScroll();
    opener.current?.focus();
    opener.current = null;
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      data-theme="dark"
      onClose={handleClose}
      onCancel={handleClose}
      aria-label="Design piece"
    >
      {project && (
        <div className={styles.inner}>
          <div className={styles.frame}>
            {/* `fill`, not width/height: the intrinsic attributes carry an
                `aspect-ratio` that outranks the CSS box and stretched the
                poster to 1620px inside a 660px frame. Filling a positioned
                parent gives `object-fit` a definite box to letterbox into. */}
            <Image
              key={project.image}
              src={project.image}
              alt={project.title}
              fill
              sizes="92vw"
              className={styles.image}
              priority
            />
          </div>

          <div className={styles.bar}>
            <div className={styles.caption}>
              <p className={styles.title}>{project.title}</p>
              <p className={cn(styles.kind, "mono")}>{project.kind}</p>
            </div>

            <div className={styles.controls}>
              <button
                type="button"
                className={styles.step}
                onClick={() => step(-1)}
                aria-label="Previous piece"
              >
                ←
              </button>
              <span className={cn(styles.counter, "mono")}>
                {String((index ?? 0) + 1).padStart(2, "0")} / {projects.length}
              </span>
              <button
                type="button"
                className={styles.step}
                onClick={() => step(1)}
                aria-label="Next piece"
              >
                →
              </button>
              <button
                type="button"
                className={styles.close}
                onClick={handleClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
