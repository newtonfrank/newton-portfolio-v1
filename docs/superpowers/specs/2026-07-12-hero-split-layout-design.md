# Hero redesign — immersive marquee (Snellenberg-style)

**Date:** 2026-07-12
**Route:** `/preview` (Hero + Intro sections)
**Motivation:** Design critique of the previous hero raised three issues — the
name/portrait `mix-blend-mode` masking obscured both face and letters, the CTA
was stranded far from the value prop, and the type was oversized. An initial
two-column "split" fix was built and rejected in favour of a cleaner, more
immersive reference direction: a full-bleed cut-out portrait on a flat neutral
field with the name running across the base as a slow right-to-left marquee.

## Asset

`public/newton-portrait.webp` is an opaque 1600×1600 image with a baked-in
off-white background and no alpha channel — and the subject wears a **white
shirt** flanked by a **dark blazer**, so no single flat-colour name reads across
the full width over it. The immersive direction therefore needs the subject on a
uniform field.

`public/newton-cutout.webp` (≈200 kB, 1172×1470, alpha) is generated from the
source by an edge flood-fill in `sharp`: BFS from the border over pixels within a
colour distance of the uniform background sets alpha→0; the subject mask is then
eroded 2px (dropping the bg-contaminated fringe ring) and feathered with a 3×3
box blur for a clean anti-aliased edge; then trimmed to the subject bbox. The
flood-fill only touches the border-connected background, so the interior white
shirt is preserved.

## Design

### Hero

- Flat neutral field (`#97999b`).
- Full-bleed cut-out portrait, face fully visible. `contain` bottom-centred on
  desktop (subject fills the height with header headroom); `cover` on mobile so
  it fills the narrow frame (shoulders crop, face intact).
- Quiet chrome: a dark location pill (globe + `hero.status`) lower-left; the role
  (`hero.role`) with a scroll-cue arrow on the right. Chrome colours are
  hard-coded (not theme tokens, which invert under `data-theme="light"`).
- Name marquee: `hero.name` joined with em-dashes, repeated across a strip that
  is duplicated so the offset wraps seamlessly within one half-width. The offset
  is **scroll-driven** (not auto-animated): each frame adds `scrollDelta × 0.85`,
  so scrolling down carries it right-to-left and scrolling up reverses it; static
  under reduced motion. White, `--font-sans`, `clamp(4.5rem, 17vw, 20rem)`,
  positioned low so it overlaps the dark lower torso and never the white shirt.
- Accessible name/role live in a visually-hidden `h1`; the marquee is
  `aria-hidden`.

### Intro

Lead (`intro.lead`) with the `MagneticButton` grouped directly beneath it —
hook + action as one unit (fixes the original "CTA stranded far-right"), then the
quieter `secondary` line. Holds the `#about` anchor.

## Preserved

`#hero` / `#about` anchors; the shared `Header` chrome; reduced-motion fallback.

## Out of scope

3D/WebGL, new photography, copy rewrites, other sections, restyling the shared
`Header` to light-over-hero.
