"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { duration, gsapEase, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./SplitText.module.css";

interface SplitTextProps {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
}

/**
 * Word-by-word masked reveal: each word sits in an overflow-hidden box and its
 * inner span translates up into view.
 *
 * Splits on words, not characters — a 60-character headline would otherwise mean
 * 60 animated nodes for no visible gain.
 *
 * Accessibility: the container carries `aria-label` with the full string and the
 * fragments are `aria-hidden`, so assistive tech reads one clean sentence rather
 * than a stream of disconnected words. Under reduced motion the wrapper spans
 * are never rendered at all, which also restores normal text selection.
 */
export function SplitText({ text, as = "span", className }: SplitTextProps) {
  const root = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      registerGsap();
      gsap.from(root.current.querySelectorAll(`.${styles.inner}`), {
        yPercent: 110,
        duration: duration.slow,
        ease: gsapEase.out,
        stagger: stagger.base,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  const Tag = as as ElementType;

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Tag
      ref={(el: HTMLElement | null) => {
        root.current = el;
      }}
      className={className}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true">
          <span className={styles.word}>
            <span className={styles.inner}>{word}</span>
          </span>
          {i < words.length - 1 && <span className={styles.space} />}
        </span>
      ))}
    </Tag>
  );
}
