/**
 * Motion tokens. Every duration, easing, stagger, and lerp factor in the app
 * comes from here — never inline a `0.3s` or a bezier.
 *
 * Mirrors the CSS custom properties in styles/tokens.css. Durations are in
 * seconds (Framer Motion / GSAP convention); the CSS mirror uses ms.
 */

/** Cubic-bezier control points, in Framer Motion's `ease` array form. */
export const ease = {
  /** Primary reveal curve — easeOutExpo feel. Confident, weighted settle. */
  out: [0.16, 1, 0.3, 1],
  /** Entrances that also need a soft start. */
  inOut: [0.65, 0, 0.35, 1],
  /** Exits and dismissals — accelerate away. */
  in: [0.4, 0, 1, 1],
  /** Playful overshoot for small delight. Use sparingly. */
  back: [0.34, 1.56, 0.64, 1],
} as const;

/** GSAP string equivalents, for ScrollTrigger timelines. */
export const gsapEase = {
  out: "expo.out",
  inOut: "power2.inOut",
  in: "power3.in",
} as const;

/** Seconds. */
export const duration = {
  /** Hover color / opacity. */
  micro: 0.15,
  /** Hover transforms, cursor. */
  fast: 0.25,
  /** Standard element reveal. */
  base: 0.5,
  /** Section reveals, large type. */
  slow: 0.8,
  /** Page / section transitions, hero handoff. */
  scene: 1.1,
  /** Loader arc. Asset-driven; this is the cap, not the target. */
  loader: 2.0,
} as const;

/** Seconds between staggered children. */
export const stagger = {
  /** Letters. */
  tight: 0.04,
  /** Words, list items. */
  base: 0.06,
  /** Cards, large blocks. */
  loose: 0.1,
} as const;

/** Lerp factors for RAF-driven follow. Higher = snappier. */
export const lerp = {
  cursor: 0.12,
  magnetic: 0.15,
  parallax: 0.08,
} as const;

export type Ease = keyof typeof ease;
export type Duration = keyof typeof duration;
