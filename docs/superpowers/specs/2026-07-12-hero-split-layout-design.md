# Hero split-layout redesign

**Date:** 2026-07-12
**Route:** `/preview` (Hero + Intro sections)
**Motivation:** Design critique of the current hero raised three issues — the
name/portrait masking obscures both face and letters, the CTA is stranded far
from the value prop, and the type is oversized with tight top spacing.

## Constraint

`public/newton-portrait.webp` is an opaque 1600×1600 VP8 image with a baked-in
off-white background and **no alpha channel**. "Text behind a cutout" would
require ML background removal with unreliable hair/edge matting. The split
layout needs no new asset — chosen for that reason.

## Design

A two-column editorial hero. Type on the left, portrait on the right, on the
existing light gradient field.

### Layout

- **Desktop (≥ 64rem):** grid, type column | portrait column.
  - Type column, top-to-bottom: name `Newton / Frank`, value-prop lead, circular
    `See work` CTA — grouped, left-aligned.
  - Portrait column: contained portrait, face fully visible.
- **Mobile (< 64rem):** stack — name, portrait, value-prop, CTA.
- The status/role nav row at the top of the hero carries over, with increased
  top padding for breathing room.

### Fix #1 — remove the masking

Drop `mix-blend-mode: difference` and the `#ffffff` fill from `.name`. The name
becomes solid `--ink`, living in its own column and never crossing the face.

### Fix #2 — regroup the CTA

Move `intro.lead` and the `MagneticButton` out of `Intro.tsx` and into the
hero's type column, directly under the name. `Intro` keeps `id="about"` and its
`secondary` paragraph as the quieter "about" beat below. No CTA in a far-right
column.

### Fix #3 — scale & spacing

Name cap `clamp(4rem, 19vw, 18rem)` → ~`clamp(3.25rem, 9vw, 9rem)` (sharing
width with the portrait, it reads ~15–20% smaller while staying a signature
element). Increase top padding above the hero content.

## Preserved

Load-in rise animation, scroll parallax on the name, reduced-motion fallback,
`#hero` / `#about` anchors, the status/role row, and the light-theme surface.

## Out of scope

3D/WebGL, new imagery, copy rewrites, other sections.
