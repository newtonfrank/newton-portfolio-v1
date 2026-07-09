"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { duration, gsapEase, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./SplitText.module.css";

type SplitTag = "h1" | "h2" | "p" | "span";

interface SplitTextProps {
  text: string;
  as?: SplitTag;
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
 *
 * The tag is rendered through an explicit switch rather than a polymorphic
 * `ElementType`: @react-three/fiber augments the global JSX namespace, which
 * collapses ElementType's prop inference to `never`.
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

  const setRef = (el: HTMLElement | null) => {
    root.current = el;
  };

  if (reduced) {
    switch (as) {
      case "h1":
        return <h1 className={className}>{text}</h1>;
      case "h2":
        return <h2 className={className}>{text}</h2>;
      case "p":
        return <p className={className}>{text}</p>;
      default:
        return <span className={className}>{text}</span>;
    }
  }

  const words = text.split(" ");

  const children = words.map((word, i) => (
    <span key={`${word}-${i}`} aria-hidden="true">
      <span className={styles.word}>
        <span className={styles.inner}>{word}</span>
      </span>
      {i < words.length - 1 && <span className={styles.space} />}
    </span>
  ));

  switch (as) {
    case "h1":
      return (
        <h1 ref={setRef} className={className} aria-label={text}>
          {children}
        </h1>
      );
    case "h2":
      return (
        <h2 ref={setRef} className={className} aria-label={text}>
          {children}
        </h2>
      );
    case "p":
      return (
        <p ref={setRef} className={className} aria-label={text}>
          {children}
        </p>
      );
    default:
      return (
        <span ref={setRef} className={className} aria-label={text}>
          {children}
        </span>
      );
  }
}
