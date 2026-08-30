"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInstrument } from "./useInstrument";
import styles from "./Instrument.module.css";

export interface Channel {
  id: "frame" | "cursor" | "scroll" | "viewport";
  label: string;
  /** VIEWPORT is a value alone — it has no time series to draw. */
  trace: boolean;
}

export const CHANNELS: Channel[] = [
  { id: "frame", label: "FRAME", trace: true },
  { id: "cursor", label: "CURSOR", trace: true },
  { id: "scroll", label: "SCROLL", trace: true },
  { id: "viewport", label: "VIEWPORT", trace: false },
];

/**
 * A live readout of the page it is running on, composed as spec-sheet rules:
 * mono label at the left margin, trace across the middle, value at the right.
 *
 * Every number is real and about the visitor — nothing here is simulated. A
 * channel with no data yet reads `—` rather than a plausible-looking figure.
 *
 * `aria-hidden` in its entirety: this is ambient telemetry that updates
 * continuously, and exposing it would be noise at best and, as a live region,
 * actively hostile. The accessible name and role live in the hero's `h1`.
 */
export function Instrument({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useInstrument(rootRef);

  // The hero's readiness signal. One frame after mount the row rules have been
  // laid out and painted, which is the honest moment to call the hero ready.
  useEffect(() => {
    if (!onFirstFrame) return;
    const id = requestAnimationFrame(() => onFirstFrame());
    return () => cancelAnimationFrame(id);
  }, [onFirstFrame]);

  return (
    <div className={styles.instrument} data-instrument ref={rootRef} aria-hidden="true">
      {CHANNELS.map((channel, i) => (
        <div
          key={channel.id}
          className={styles.row}
          data-channel={channel.id}
          style={{ ["--i" as string]: i }}
        >
          <span className={cn(styles.label, "mono")} data-label>
            {channel.label}
          </span>
          {channel.trace ? (
            <canvas className={styles.trace} data-trace={channel.id} />
          ) : (
            <span className={styles.rule} />
          )}
          <span className={cn(styles.value, "mono")} data-value={channel.id}>
            —
          </span>
        </div>
      ))}
    </div>
  );
}
