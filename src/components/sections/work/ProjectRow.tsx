"use client";

import type { Project } from "@/types/content";
import { cn } from "@/lib/utils";
import styles from "./ProjectList.module.css";

interface ProjectRowProps {
  project: Project;
  index: number;
  /** Index of the currently hovered row, or null. */
  active: number | null;
  /** Whether the floating-preview experience is on (fine pointer, motion ok). */
  fine: boolean;
  onActivate: (index: number) => void;
  /** Small inline thumbnail shown only on the coarse-pointer fallback. */
  children?: React.ReactNode;
}

/**
 * One row of the editorial project list. Full ink normally; dimmed when another
 * row is the active one. Activates on hover AND focus so the reveal is reachable
 * by keyboard, not only by mouse.
 */
export function ProjectRow({
  project,
  index,
  active,
  fine,
  onActivate,
  children,
}: ProjectRowProps) {
  const dimmed = active !== null && active !== index;

  const activate = () => onActivate(index);

  const body = (
    <>
      <span className={styles.rowIndex}>{String(index + 1).padStart(2, "0")}</span>
      <span className={styles.rowTitle}>{project.displayTitle.join(" ")}</span>
      <span className={cn(styles.rowMeta, "mono")}>
        {project.category}
        <span className={styles.rowArrow} aria-hidden="true">
          ↗
        </span>
      </span>
    </>
  );

  return (
    <li
      className={cn(styles.row, dimmed && styles.rowDimmed)}
      onPointerEnter={fine ? activate : undefined}
    >
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className={styles.rowLink}
          onFocus={fine ? activate : undefined}
          data-cursor={fine ? "none" : undefined}
        >
          {body}
        </a>
      ) : (
        <span className={styles.rowLink} data-cursor={fine ? "none" : undefined}>
          {body}
        </span>
      )}
      {children}
    </li>
  );
}
