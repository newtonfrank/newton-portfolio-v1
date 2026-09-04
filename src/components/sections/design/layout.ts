import type { DesignProject } from "@/types/content";

/**
 * Where every card sits in the field.
 *
 * All of it is derived from fixed tables rather than `Math.random()`. The scene
 * remounts whenever the canvas is lazily attached, and a random composition
 * would reshuffle itself under the viewer — the scatter is a design decision, so
 * it is written down.
 *
 * Units are three.js world units. The camera (scene/Stage.tsx) is placed so that
 * roughly 6.3 of them fill the viewport height at z = 0.
 */

/** Card width by tier, before the height cap. */
const TIER_WIDTH = { s: 2.2, m: 2.9, l: 3.6 } as const;

/** Nothing may be taller than this, or the tall A4 posters overflow the stage. */
const MAX_HEIGHT = 4.4;

/**
 * Horizontal breathing room between neighbours. Deliberately tight: the depth
 * spread below pushes cards apart as they travel, so a generous resting gap
 * leaves the far end of the field looking empty.
 */
const GAP = 0.4;

type Tier = keyof typeof TIER_WIDTH;

/** Shuffled so no three neighbours share a size. */
const TIERS: Tier[] = [
  "m",
  "l",
  "s",
  "m",
  "l",
  "s",
  "l",
  "m",
  "s",
  "l",
  "m",
  "s",
  "m",
  "l",
  "s",
  "l",
  "m",
];

/** Vertical offset, world units. Sums to roughly zero so the field stays centred. */
const Y = [
  0.35, -0.5, 0.15, -0.3, 0.55, -0.15, 0.4, -0.55, 0.2, -0.4, 0.5, -0.2, 0.3, -0.45, 0.15, -0.35,
  0.45,
];

/**
 * Depth. Negative is further from the camera. Perspective turns this into
 * foreshortening and scale for free; `speed` below turns it into parallax.
 */
const Z = [
  -1.0, 0.7, -2.3, 0.35, -1.5, 1.0, -0.5, -2.6, 0.8, -1.3, 0.2, -1.9, 0.9, -0.75, -2.2, 0.5, -1.7,
];

/** Fixed z-tilt in degrees — the "dropped on a table" angle. */
const ROTATION = [-6, 4, -2.5, 7, -4.5, 2, -7.5, 5.5, -1.5, 6.5, -5, 3, -8, 4.5, -3, 7.5, -2];

const DEG = Math.PI / 180;

export interface CardPlacement {
  /** Plane width and height, world units. */
  width: number;
  height: number;
  /** Resting x before the track offset is applied. */
  x: number;
  y: number;
  z: number;
  /** Z-tilt, radians. */
  rotation: number;
  /**
   * How fast this card answers the track. Derived from depth, so far cards lag
   * and near cards run ahead — the parallax that makes the field read as a
   * space rather than a strip.
   *
   * The coefficient is small on purpose. It multiplies the *whole* travel, so
   * at 0.055 the extremes drifted seventeen world units apart by the end and
   * tore the composition open; 0.018 keeps the spread near two units, which
   * reads as depth without stranding anything.
   */
  speed: number;
}

export interface FieldLayout {
  cards: CardPlacement[];
  /** Total world width of the field, used to size the scroll runway. */
  span: number;
}

/**
 * Lay the field out left to right. Widths come from the tier table, heights
 * from the piece's true aspect — so the three banners stay banners and nothing
 * is cropped — with a cap that trades width away rather than let a tall poster
 * outgrow the stage.
 */
export function layoutField(projects: DesignProject[]): FieldLayout {
  let cursor = 0;

  const cards = projects.map((project, i) => {
    let width = TIER_WIDTH[TIERS[i % TIERS.length]];
    let height = width / project.aspect;

    if (height > MAX_HEIGHT) {
      height = MAX_HEIGHT;
      width = height * project.aspect;
    }

    const x = cursor + width / 2;
    cursor += width + GAP;

    const z = Z[i % Z.length];

    return {
      width,
      height,
      x,
      y: Y[i % Y.length],
      z,
      rotation: ROTATION[i % ROTATION.length] * DEG,
      speed: 1 + z * 0.018,
    };
  });

  return { cards, span: Math.max(0, cursor - GAP) };
}
