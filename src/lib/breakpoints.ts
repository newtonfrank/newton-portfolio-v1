/**
 * TS mirror of the breakpoints in styles/tokens.css.
 *
 * CSS custom properties cannot be used inside media queries, so the values are
 * necessarily duplicated. This module is the JS-side source; if you change one,
 * change both.
 */

/** Min-widths, in pixels. */
export const breakpoints = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

/** `min-width` media query string for a breakpoint, e.g. for matchMedia. */
export function up(bp: Breakpoint): string {
  return `(min-width: ${breakpoints[bp]}px)`;
}

/** `max-width` media query string, exclusive of the breakpoint itself. */
export function down(bp: Breakpoint): string {
  return `(max-width: ${breakpoints[bp] - 0.02}px)`;
}
