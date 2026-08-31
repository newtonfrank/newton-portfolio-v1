/**
 * Small, dependency-free helpers.
 *
 * `cn` is a plain class joiner, not the clsx + tailwind-merge pairing you may
 * have seen elsewhere: this codebase uses CSS Modules, where class names are
 * hashed and locally scoped, so there are no conflicting utility classes to
 * merge away.
 */

type ClassValue = string | number | null | undefined | false;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Linear interpolation. `t` is not clamped. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Remap `value` from one range to another. Does not clamp. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  if (inMax === inMin) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
