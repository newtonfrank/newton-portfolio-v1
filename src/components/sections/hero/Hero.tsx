"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { hero } from "@/content/site";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import styles from "./Hero.module.css";

/**
 * Immersive minimal hero (Snellenberg-style). A full-bleed cut-out portrait
 * stands on a flat neutral field; the name runs across the base as a marquee
 * whose position tracks scroll — scrolling down carries it right-to-left,
 * scrolling up reverses it. Chrome is deliberately quiet: a location pill on
 * the left, the role with a scroll cue on the right.
 *
 * The portrait is `priority` — it's the LCP element. The marquee is decorative
 * (`aria-hidden`); the accessible name/role live in a visually-hidden `h1`.
 */
export function Hero() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Drive the marquee offset from scroll delta. The strip is duplicated, so the
  // offset wraps within one half-width — and since the two halves are identical,
  // the wrap is seamless. Down → offset grows → moves left; up → shrinks → right.
  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.85; // marquee px per scrolled px
    let half = 0;
    let pos = 0;
    let last = window.scrollY;
    let frame = 0;

    const measure = () => {
      half = track.scrollWidth / 2;
    };
    const render = () => {
      frame = 0;
      if (half <= 0) measure();
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      if (half > 0) {
        pos = (pos + delta * speed) % half;
        if (pos < 0) pos += half;
        track.style.transform = `translate3d(${-pos}px, 0, 0)`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    measure();
    const settle = setTimeout(measure, 400); // re-measure once web fonts land
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [reduced]);

  // One marquee unit; rendered enough times to overflow, then the whole strip
  // is duplicated so the scroll-driven wrap loops seamlessly.
  const unit = hero.name.join(" — ");
  const strip = Array.from({ length: 4 }, () => unit);

  return (
    <section id="hero" className={styles.hero}>
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
        />
      </div>

      <div className={styles.chrome}>
        <span className={cn(styles.locate, "mono")}>
          <span className={styles.globe} aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-globe-icon lucide-globe"
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

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track} ref={trackRef}>
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
