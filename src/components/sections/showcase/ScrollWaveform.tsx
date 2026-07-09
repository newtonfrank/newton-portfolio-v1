"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./ScrollWaveform.module.css";

const BAR_WIDTH = 2;
const BAR_GAP = 3;
const MIN_BARS = 32;

/** Deterministic pseudo-noise so the waveform is stable across renders and SSR. */
function sampleAmplitude(index: number): number {
  const a = Math.sin(index * 12.9898) * 43758.5453;
  const b = Math.sin(index * 0.37) * 0.5 + 0.5;
  const noise = a - Math.floor(a);
  return 0.18 + noise * 0.35 + b * 0.28;
}

interface ScrollWaveformProps {
  slideCount: number;
  /** Live carousel position in slide units. Read per frame, never rendered. */
  progressRef: React.RefObject<number>;
  /**
   * The tall scroll section. Visibility is measured against this, not the
   * waveform itself — the waveform is `position: fixed` and would always
   * report as intersecting.
   */
  sectionRef: React.RefObject<HTMLElement | null>;
}

/**
 * Audio-visualiser-style scrub bar, standing in for a slide counter.
 *
 * Bars swell near the playhead and dim behind it; bars sitting on a slide
 * boundary stay brighter, so the number of projects is still readable at a
 * glance without a "01 / 04" label.
 *
 * Driven by a rAF loop that mutates styles directly — the whole point of
 * keeping scroll progress in a ref is that this never re-renders React. The
 * loop is suspended by IntersectionObserver whenever the section is off-screen
 * (BUILD_GUIDE.md 5.8: kill loops you cannot see).
 */
export function ScrollWaveform({ slideCount, progressRef, sectionRef }: ScrollWaveformProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();

  const [barCount, setBarCount] = useState(MIN_BARS);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const next = Math.max(MIN_BARS, Math.floor(track.clientWidth / (BAR_WIDTH + BAR_GAP)));
      setBarCount((current) => (current === next ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  /** Bar indices that sit on a slide boundary. */
  const boundaries = useMemo(() => {
    const set = new Set<number>();
    for (let slide = 0; slide < slideCount; slide += 1) {
      const ratio = slideCount === 1 ? 0 : slide / (slideCount - 1);
      set.add(Math.round(ratio * (barCount - 1)));
    }
    return set;
  }, [slideCount, barCount]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    let visible = true;
    let time = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible) return;

      time += 0.016;

      const span = Math.max(1, slideCount - 1);
      const ratio = clamp(progressRef.current ?? 0, 0, span) / span;

      const playhead = playheadRef.current;
      if (playhead) {
        playhead.style.transform = `translateX(${ratio * track.clientWidth}px)`;
      }

      for (let i = 0; i < barCount; i += 1) {
        const bar = barRefs.current[i];
        if (!bar) continue;

        const x = barCount === 1 ? 0 : i / (barCount - 1);
        const distance = Math.abs(x - ratio);

        // Swell near the playhead, decaying quickly either side of it.
        const proximity = Math.exp(-distance * 22);
        const shimmer = reduced ? 0 : Math.sin(time * 4 + i * 0.6) * 0.06 * proximity;

        const amplitude = sampleAmplitude(i) * (0.45 + proximity * 1.5) + shimmer;
        bar.style.transform = `scaleY(${clamp(amplitude, 0.06, 1)})`;

        // Played bars read brighter than upcoming ones.
        const played = x <= ratio ? 0.62 : 0.2;
        bar.style.opacity = String(clamp(played + proximity * 0.55, 0, 1));
      }
    };

    const section = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    if (section) observer.observe(section);

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [barCount, slideCount, progressRef, sectionRef, reduced]);

  return (
    <div className={styles.waveform} aria-hidden="true">
      <div
        ref={trackRef}
        className={styles.track}
        style={
          {
            "--bar-width": `${BAR_WIDTH}px`,
            "--bar-gap": `${BAR_GAP}px`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: barCount }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              barRefs.current[i] = el;
            }}
            className={boundaries.has(i) ? `${styles.bar} ${styles.boundary}` : styles.bar}
          />
        ))}
        <div ref={playheadRef} className={styles.playhead} />
      </div>
    </div>
  );
}
