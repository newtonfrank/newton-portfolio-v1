import type Lenis from "lenis";

/**
 * The active Lenis instance, registered by `SmoothScroll`.
 *
 * A module singleton rather than a context because the only consumer is the
 * scroll lock below, and threading a provider through the tree for one boolean
 * would cost more than it explains. There is exactly one instance: `SmoothScroll`
 * wraps the whole page.
 *
 * It is null whenever smooth scroll isn't running — under reduced motion Lenis
 * is never constructed at all — so every read has to tolerate that.
 */
let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null): void {
  instance = lenis;
}

/**
 * Freezes the page behind a full-screen overlay.
 *
 * Both halves are needed: `overflow: hidden` stops native and touch scrolling,
 * and `lenis.stop()` stops Lenis, which drives scroll position programmatically
 * from its own RAF loop and would otherwise keep animating the page underneath.
 */
export function lockScroll(): void {
  instance?.stop();
  document.body.style.overflow = "hidden";
}

export function unlockScroll(): void {
  document.body.style.removeProperty("overflow");
  instance?.start();
}
