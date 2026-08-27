"use client";

import { useEffect, useRef } from "react";
import { lerp as lerpFactors } from "@/lib/motion";
import { cn, lerp } from "@/lib/utils";
import { useFinePointer } from "@/hooks/useFinePointer";
import styles from "./MagneticButton.module.css";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  /** Ink = dark circle on light ground; accent = ember circle. */
  variant?: "ink" | "accent";
  /** Diameter in rem. */
  size?: number;
  /** How far the button chases the pointer (0–1 of its own radius). */
  strength?: number;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
}

/**
 * A circular button that eases toward the pointer while hovered — the
 * reference's "About me" / "Get in touch" moment. The pull is RAF-lerped so it
 * feels weighted rather than glued to the cursor, and the label drifts a touch
 * further than the disc for parallax depth.
 *
 * On coarse pointers or under reduced motion (`useFinePointer`) the magnetism
 * is skipped entirely and this is a plain, statically-placed circular link.
 */
export function MagneticButton({
  children,
  href,
  external,
  variant = "ink",
  size = 8,
  strength = 0.4,
  className,
  ariaLabel,
  onClick,
}: MagneticButtonProps) {
  const fine = useFinePointer();
  const rootRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const setRoot = (node: HTMLElement | null) => {
    rootRef.current = node;
  };

  useEffect(() => {
    const root = rootRef.current;
    const label = labelRef.current;
    if (!fine || !root) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      // Offset of the pointer from the button's centre, scaled by strength.
      target.x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      target.y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const render = () => {
      frame = requestAnimationFrame(render);
      current.x = lerp(current.x, target.x, lerpFactors.magnetic);
      current.y = lerp(current.y, target.y, lerpFactors.magnetic);
      root.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      if (label) {
        label.style.transform = `translate3d(${current.x * 0.35}px, ${current.y * 0.35}px, 0)`;
      }
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(render);

    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      root.style.transform = "";
      if (label) label.style.transform = "";
    };
  }, [fine, strength]);

  const classes = cn(styles.button, styles[variant], className);
  const style = { ["--size" as string]: `${size}rem` };
  const inner = (
    <span ref={labelRef} className={styles.label}>
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        ref={setRoot}
        href={href}
        className={classes}
        style={style}
        aria-label={ariaLabel}
        data-cursor="hover"
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={setRoot}
      type="button"
      className={classes}
      style={style}
      aria-label={ariaLabel}
      data-cursor="hover"
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
