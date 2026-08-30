"use client";

import { useEffect, type RefObject } from "react";

/**
 * Frame time above which a sample counts as a dropped frame, in ms. A real
 * stutter at 60Hz with tolerance, and still a real one at 120Hz.
 *
 * Not a CSS token: this is instrument calibration, not a design magnitude.
 */
export const ALARM_MS = 20;

/** Samples retained per channel (~3s at 60Hz). */
export const WINDOW = 180;

/**
 * Readout refresh, ms. Traces redraw every frame, but the numbers damp to 8Hz —
 * a value changing sixty times a second is unreadable noise, which is why real
 * instruments damp their displays.
 */
export const READOUT_MS = 125;

/** Velocity channels fall back toward zero when idle, or they freeze at their
 *  last value and read as broken. Multiplier per millisecond. */
const DECAY_PER_MS = 0.994;

/** Autoscale floor for velocity channels, px/s — stops idle noise filling the
 *  trace height. */
const VELOCITY_FLOOR = 200;

/** Trace stroke width in CSS px, before DPR scaling. */
const LINE_PX = 1.25;

type TraceId = "frame" | "cursor" | "scroll";
const TRACES: TraceId[] = ["frame", "cursor", "scroll"];

interface Series {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  samples: Float32Array;
  /** Fixed ceiling (frame), or autoscaled running max (velocities). */
  fixedMax: number | null;
}

/**
 * Owns everything the instrument does at runtime: sampling the page, holding
 * the ring buffers, drawing the traces, and formatting the readouts.
 *
 * Finds its elements by `data-` attribute inside the root, matching the pattern
 * `useHeroEntrance` uses for `[data-track]` — the component owns the markup,
 * the hook owns the behaviour, and no refs are drilled between them.
 *
 * Reduced motion is read synchronously here rather than via `useReducedMotion`,
 * which returns `false` on the first render and corrects after mount — enough to
 * leak a frame of motion to someone who asked for none.
 */
export function useInstrument(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const series = new Map<TraceId, Series>();
    for (const id of TRACES) {
      const canvas = root.querySelector<HTMLCanvasElement>(`[data-trace="${id}"]`);
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) continue;
      series.set(id, {
        canvas,
        ctx,
        samples: new Float32Array(WINDOW),
        fixedMax: id === "frame" ? ALARM_MS * 1.65 : null,
      });
    }

    const values = new Map<string, HTMLElement>();
    for (const el of root.querySelectorAll<HTMLElement>("[data-value]")) {
      values.set(el.dataset.value ?? "", el);
    }

    // Stroke colours come from the tokens, never from a literal in JS.
    const styles = getComputedStyle(root);
    const signal = styles.getPropertyValue("--signal").trim();

    let head = 0;
    let cursorV = 0;
    let scrollV = 0;
    let lastY = window.scrollY;
    let lastPointer: { x: number; y: number; t: number } | null = null;
    let prev = performance.now();
    let lastReadout = 0;
    let frame = 0;
    let alive = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      for (const s of series.values()) {
        const rect = s.canvas.getBoundingClientRect();
        s.canvas.width = Math.max(1, Math.round(rect.width * dpr));
        s.canvas.height = Math.max(1, Math.round(rect.height * dpr));
      }
      const viewport = values.get("viewport");
      if (viewport) viewport.textContent = `${window.innerWidth}×${window.innerHeight}`;
    };

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (lastPointer) {
        const dt = now - lastPointer.t;
        if (dt > 0) {
          const dx = event.clientX - lastPointer.x;
          const dy = event.clientY - lastPointer.y;
          cursorV = (Math.hypot(dx, dy) / dt) * 1000;
        }
      }
      lastPointer = { x: event.clientX, y: event.clientY, t: now };
    };

    const scaleFor = (s: Series) => {
      if (s.fixedMax !== null) return s.fixedMax;
      let max = VELOCITY_FLOOR;
      for (const v of s.samples) if (v > max) max = v;
      return max;
    };

    const drawTrace = (s: Series) => {
      const { ctx, canvas, samples } = s;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width;
      const h = canvas.height;
      const line = LINE_PX * dpr;
      const max = scaleFor(s);
      const stepX = w / (WINDOW - 1);
      const yOf = (v: number) => h - line / 2 - (Math.min(v, max) / max) * (h - line);

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = line;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = signal;
      ctx.beginPath();
      for (let i = 0; i < WINDOW; i++) {
        // Oldest sample at the left, newest at the right.
        const v = samples[(head + i) % WINDOW];
        const x = i * stepX;
        if (i === 0) ctx.moveTo(x, yOf(v));
        else ctx.lineTo(x, yOf(v));
      }
      ctx.stroke();
    };

    const writeReadouts = () => {
      const frameEl = values.get("frame");
      const cursorEl = values.get("cursor");
      const scrollEl = values.get("scroll");
      const frameSeries = series.get("frame");
      if (frameEl && frameSeries) {
        const latest = frameSeries.samples[(head - 1 + WINDOW) % WINDOW];
        frameEl.textContent = `${latest.toFixed(1)}ms`;
      }
      if (cursorEl) cursorEl.textContent = `${Math.round(cursorV)}px/s`;
      if (scrollEl) scrollEl.textContent = `${Math.round(scrollV)}px/s`;
    };

    const sample = (dt: number) => {
      const y = window.scrollY;
      // Only recompute from a real position change. Recomputing every frame
      // from the instantaneous frame-to-frame delta means a single discrete
      // jump (a wheel tick outside Lenis, a programmatic `scrollTo`) shows
      // exactly one non-zero frame, then the very next frame's zero delta
      // overwrites it before the decay below gets a chance to act — a hard
      // snap to zero, not the fade the other velocity channel gets. Gating
      // on an actual change makes scroll decay the same way cursor does:
      // set on new motion, faded by DECAY_PER_MS otherwise.
      if (dt > 0 && y !== lastY) scrollV = (Math.abs(y - lastY) / dt) * 1000;
      lastY = y;

      const decay = Math.pow(DECAY_PER_MS, dt);
      cursorV *= decay;
      scrollV *= decay;

      series.get("frame")!.samples[head] = dt;
      series.get("cursor")!.samples[head] = cursorV;
      series.get("scroll")!.samples[head] = scrollV;
      head = (head + 1) % WINDOW;
    };

    const step = () => {
      if (!alive) return;
      const now = performance.now();
      // Clamped so a backgrounded tab cannot spike the frame trace on return.
      const dt = Math.min(now - prev, 100);
      prev = now;

      sample(dt);
      for (const s of series.values()) drawTrace(s);
      if (now - lastReadout >= READOUT_MS) {
        writeReadouts();
        lastReadout = now;
      }
      frame = requestAnimationFrame(step);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    window.addEventListener("resize", resize);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One honest frame, then nothing. No loop, no pointer listener.
      sample(1000 / 60);
      for (const s of series.values()) drawTrace(s);
      writeReadouts();
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", resize);
      };
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(step);

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [rootRef]);
}
