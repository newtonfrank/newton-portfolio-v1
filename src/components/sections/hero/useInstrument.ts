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
  row: HTMLElement | null;
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
        row: root.querySelector<HTMLElement>(`[data-channel="${id}"]`),
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
    // Falls back to `currentColor` (a CSS keyword, not a literal) if the
    // token ever resolves empty — an empty strokeStyle draws silently in
    // black rather than erroring, which would be worse than this fallback.
    const signal = styles.getPropertyValue("--signal").trim() || "currentColor";
    const ember = styles.getPropertyValue("--ember").trim() || "currentColor";

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

      if (s.fixedMax === null) return;

      // The frame channel is the only one with a budget to blow. Redraw just the
      // segments that exceeded it in the alarm colour, and flag the row so the
      // condition is observable without reading pixels.
      let alarming = false;
      ctx.strokeStyle = ember;
      for (let i = 1; i < WINDOW; i++) {
        const a = samples[(head + i - 1) % WINDOW];
        const b = samples[(head + i) % WINDOW];
        if (a < ALARM_MS && b < ALARM_MS) continue;
        alarming = true;
        ctx.beginPath();
        ctx.moveTo((i - 1) * stepX, yOf(a));
        ctx.lineTo(i * stepX, yOf(b));
        ctx.stroke();
      }
      if (s.row) {
        if (alarming) s.row.dataset.alarm = "true";
        else delete s.row.dataset.alarm;
      }
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
      // Decay runs before the recompute below, not after. Applying it to a
      // frame's own fresh measurement would show every live reading ~10%
      // low; decaying only the carried-over value, then overwriting with
      // whatever this frame actually measured, means a frame that measured
      // something displays exactly what it measured — only idle frames
      // (nothing new this tick) fade toward zero.
      const decay = Math.pow(DECAY_PER_MS, dt);
      cursorV *= decay;
      scrollV *= decay;

      const y = window.scrollY;
      // Only recompute from a real position change. Recomputing every frame
      // from the instantaneous frame-to-frame delta means a single discrete
      // jump (a wheel tick outside Lenis, a programmatic `scrollTo`) shows
      // exactly one non-zero frame, then the very next frame's zero delta
      // overwrites it before decay gets a chance to act — a hard snap to
      // zero, not the fade the other velocity channel gets. Gating on an
      // actual change makes scroll decay the same way cursor does: set on
      // new motion, faded by DECAY_PER_MS otherwise.
      if (dt > 0 && y !== lastY) scrollV = (Math.abs(y - lastY) / dt) * 1000;
      lastY = y;

      // Guarded lookups, not `!` assertions: `getContext` can return null in
      // setup, in which case a channel is deliberately absent from the map
      // (see the `continue` above) — asserting non-null here would then
      // throw on every frame instead of just quietly having one fewer trace.
      const frameSeries = series.get("frame");
      const cursorSeries = series.get("cursor");
      const scrollSeries = series.get("scroll");
      if (frameSeries) frameSeries.samples[head] = dt;
      if (cursorSeries) cursorSeries.samples[head] = cursorV;
      if (scrollSeries) scrollSeries.samples[head] = scrollV;
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
      frame = wanted() ? requestAnimationFrame(step) : 0;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    window.addEventListener("resize", resize);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One honest frame, then nothing. The elapsed time is measured inside
      // a real requestAnimationFrame callback, not assumed — a canned figure
      // here would be the only invented number on the page, and it would sit
      // in the one place a visitor cannot watch it update to notice. No
      // loop (the callback never reschedules itself), no pointer listener.
      frame = requestAnimationFrame(() => {
        if (!alive) return;
        sample(Math.min(performance.now() - prev, 100));
        for (const s of series.values()) drawTrace(s);
        writeReadouts();
      });
      return () => {
        alive = false;
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("resize", resize);
      };
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // A permanent 60fps loop on a page people leave open is a battery cost with
    // no upside once nobody can see it.
    let onScreen = true;
    const wanted = () => onScreen && document.visibilityState === "visible";

    const sync = () => {
      if (!alive) return;
      if (wanted() && !frame) {
        // Reset the clock, or the first frame back reports the whole gap.
        prev = performance.now();
        frame = requestAnimationFrame(step);
      } else if (!wanted() && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const visible = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    // Observe the hero section, not `root` (the instrument itself): the
    // instrument is small and sits high in the section, so it clears the
    // viewport on scroll long before the hero does — observing it directly
    // would suspend the loop while the instrument is still visibly on screen.
    const watched = root.closest("#hero") ?? root;
    visible.observe(watched);
    document.addEventListener("visibilitychange", sync);

    sync();

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      visible.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [rootRef]);
}
