"use client";

import { useEffect, useRef, type RefObject } from "react";

import { duration } from "@/lib/motion";

/** Marquee px per scrolled px. Unchanged from the original inline effect. */
const SCROLL_SPEED = 0.85;

/** Whole marquee units travelled during the settle. Must be an integer, or
 *  the strip lands out of register and the resting frame shifts per load. */
const SETTLE_UNITS = 1;

/** Never jump-cut a warm cache; there is always a visible settle. */
const MIN_SPIN_MS = 250;

/**
 * `easeOutCubic`'s velocity at t=0 is exactly 3·distance/duration. Deriving
 * cruise speed from that makes the hand-off velocity-continuous, so the
 * marquee only ever slows down. Picking cruise independently would make it
 * visibly *accelerate* at the moment it starts to settle.
 *
 * This is the one place the JS departs from `--ease-out` (an expo curve, whose
 * ~6.9 multiplier would demand an absurd cruise speed). The CSS beats use it.
 */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const CRUISE_UNITS_PER_SEC = (3 * SETTLE_UNITS) / duration.scene;

/**
 * Owns every transform applied to the name marquee. There is exactly one rAF
 * loop touching the offset, so scroll-driven motion and the load-time settle
 * can never disagree about position.
 *
 * The entrance is a three-phase machine: `cruise` runs at constant velocity
 * while the page loads, `decel` eases a whole number of marquee units into a
 * register-locked stop, and `rest` hands the offset back to the scroll
 * listener. Because the strip is identical units end to end, resting on a unit
 * boundary makes the resting frame identical on every load.
 *
 * Reduced motion is checked synchronously here rather than via
 * `useReducedMotion`, which returns `false` on the first render and corrects
 * after mount — enough to leak a frame of motion to someone who asked for none.
 */
export function useHeroEntrance(
  containerRef: RefObject<HTMLElement | null>,
  { ready }: { ready: boolean }
): void {
  // Mirrored into a ref: `ready` flipping must not re-run the effect, which
  // would tear down a settle already in progress and start it over.
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = container.querySelector<HTMLElement>('[data-track="main"]');
    if (!main) return;

    const ghosts = Array.from(container.querySelectorAll<HTMLElement>('[data-track="ghost"]'));

    // Width of one repeated unit. The strip is identical units end to end, so
    // wrapping on this is seamless — and keeps the offset small.
    let unit = 0;
    let entrancePos = 0; // driven by cruise / decel
    let scrollPos = 0; // driven by the wheel
    let phase: "cruise" | "decel" | "rest" = "cruise";
    let decelStart = 0;
    let startPos = 0;
    let targetPos = 0;
    let lastScrollY = window.scrollY;
    let prev = performance.now();
    const t0 = prev;
    let frame = 0;
    let alive = true;

    const measure = () => {
      const first = main.firstElementChild as HTMLElement | null;
      unit = first?.offsetWidth ?? 0;
      // A resize changes `unit`, so the old `entrancePos` (a multiple of the
      // *previous* unit) is no longer on-register. 0 is a multiple of every
      // unit, so resetting to it re-quantizes without a visible jump, and the
      // frame loop is no longer free-running at rest — schedule one frame so
      // the corrected position actually paints.
      if (phase === "rest") {
        entrancePos = 0;
        if (!frame) frame = requestAnimationFrame(step);
      }
    };

    const paint = (travel: number) => {
      // Before the strip has been measured there is no meaningful wrap, and
      // painting the raw offset would show an unbounded slide. Skip entirely.
      if (unit <= 0) return;
      const total = entrancePos + scrollPos;
      const pos = ((total % unit) + unit) % unit;
      main.style.transform = `translate3d(${-pos}px, 0, 0)`;

      if (phase === "rest") return;

      // Normalised against cruise speed, so the smear reads the same at any
      // viewport width: full strength while cruising, fading as it settles.
      const cruisePerFrame = (unit * CRUISE_UNITS_PER_SEC) / 60;
      const smear = cruisePerFrame > 0 ? Math.min(1, Math.abs(travel) / cruisePerFrame) : 0;
      container.style.setProperty("--smear", smear.toFixed(3));

      ghosts.forEach((ghost, i) => {
        const trail = travel * (i + 1) * 0.5;
        ghost.style.transform = `translate3d(${-pos + trail}px, 0, 0)`;
      });
    };

    const step = () => {
      frame = 0;
      if (!alive) return;
      const now = performance.now();
      // Clamped so a backgrounded tab cannot fling the marquee on return.
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      if (!unit) measure();

      // Scroll always applies. The entrance never locks the page.
      const y = window.scrollY;
      scrollPos += (y - lastScrollY) * SCROLL_SPEED;
      lastScrollY = y;

      const before = entrancePos;

      if (phase === "cruise") {
        const was = entrancePos;
        entrancePos += unit * CRUISE_UNITS_PER_SEC * dt;
        // Hand off only on the frame the strip crosses a unit boundary. Aiming
        // the settle at `boundary + SETTLE_UNITS · unit` is what puts rest in
        // register; waiting for the crossing (rather than snapping to it) is
        // what keeps the hand-off free of a positional jump. The settle then
        // covers one unit less the sub-frame overshoot — marginally *slower*
        // than cruise, never faster.
        if (
          unit > 0 &&
          readyRef.current &&
          now - t0 >= MIN_SPIN_MS &&
          Math.floor(entrancePos / unit) > Math.floor(was / unit)
        ) {
          phase = "decel";
          decelStart = now;
          startPos = entrancePos;
          targetPos = Math.floor(entrancePos / unit) * unit + unit * SETTLE_UNITS;
        }
      } else if (phase === "decel") {
        const t = Math.min((now - decelStart) / (duration.scene * 1000), 1);
        entrancePos = startPos + (targetPos - startPos) * easeOutCubic(t);
        if (t >= 1) {
          phase = "rest";
          entrancePos = targetPos;
          container.dataset.marquee = "rest";
        }
      }

      paint(entrancePos - before);
      // Free-running only during the entrance; at rest the scroll listener
      // schedules single frames, exactly as before.
      if (phase !== "rest") frame = requestAnimationFrame(step);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    measure();
    // The real signal for "the type has its final metrics", replacing a 400ms
    // guess. The register lock is wrong if this is measured early.
    void document.fonts.ready.then(() => {
      if (alive) measure();
    });

    frame = requestAnimationFrame(step);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [containerRef]);
}
