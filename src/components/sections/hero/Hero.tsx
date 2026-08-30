"use client";

import { useRef } from "react";
import Image from "next/image";
import { hero } from "@/content/site";
import { useSiteReady } from "@/hooks/useSiteReady";
import { cn } from "@/lib/utils";
import { useHeroEntrance } from "./useHeroEntrance";
import styles from "./Hero.module.css";

/**
 * Immersive minimal hero (Snellenberg-style). A full-bleed cut-out portrait
 * stands on a flat neutral field; the name runs across the base as a marquee
 * whose position tracks scroll — scrolling down carries it right-to-left,
 * scrolling up reverses it. Chrome is deliberately quiet: a location pill on
 * the left, the role with a scroll cue on the right.
 *
 * The portrait is `priority` — it's the LCP element. The marquee's offset is
 * owned entirely by `useHeroEntrance`; this component only supplies the
 * markup and the container ref.
 */
export function Hero() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { ready, markAssetReady } = useSiteReady();
  useHeroEntrance(marqueeRef, { ready });

  // One marquee unit; rendered enough times to overflow, then the whole strip
  // is duplicated so the scroll-driven wrap loops seamlessly.
  const unit = hero.name.join(" — ");
  const strip = Array.from({ length: 4 }, () => unit);

  return (
    <section id="hero" className={styles.hero} data-ready={ready ? "true" : "false"}>
      <h1 className={styles.srName}>
        {hero.name.join(" ")} — {hero.role}
      </h1>

      <div className={styles.portrait}>
        <Image
          src="/newton-cutout-v2.webp"
          alt="Newton Frank"
          fill
          priority
          sizes="100vw"
          className={styles.image}
          onLoad={markAssetReady}
        />
      </div>

      <div className={styles.chrome}>
        <span className={cn(styles.locate, "mono")}>
          <span className={styles.globe} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </span>
          {hero.status}
        </span>

        <span className={styles.role}>
          <span className={styles.arrow} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M7 7l10 10M17 17V8M17 17H8" />
            </svg>
          </span>
          <span className={cn(styles.roleText, "mono")}>{hero.role}</span>
        </span>
      </div>

      <div className={styles.marquee} ref={marqueeRef} aria-hidden="true">
        <div className={styles.track} data-track="main">
          {strip.map((text, i) => (
            <span key={`a${i}`} className={styles.word}>
              {text}
              <span className={styles.sep}> — </span>
            </span>
          ))}
          {strip.map((text, i) => (
            <span key={`b${i}`} className={styles.word}>
              {text}
              <span className={styles.sep}> — </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
