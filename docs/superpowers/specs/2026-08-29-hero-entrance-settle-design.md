# Hero entrance — "Settle"

**Date:** 2026-08-29
**Route:** `/` (Hero section only)
**Milestone:** the loading beat the design system always reserved
(`lib/motion.ts` → `duration.loader: 2.0`, *"asset-driven; this is the cap, not
the target"*) but never built.

## Motivation

The site has no first-load choreography. The beat specced for one — `02-STRATEGY.md`
§C.1 and `TASKS.md` M3: wordmark draw-in, mono `0→100` counter, Ember→Signal
progress bar, mask wipe — is both the genre's most-used preloader and a design for
a world that no longer exists (no three.js, no dark hero; see the 2026-07-13
consolidation).

`Settle` replaces it with an entrance that cannot be copied off another site,
because it is this site's own physics: the hero's scroll-driven name marquee
(`Hero.tsx:28-70`) arrives at speed and decelerates into rest, while the portrait
resolves in place.

**There is no loading screen.** Nothing covers the page, no progress is invented,
and if assets are slow the marquee simply keeps sweeping — the wait *is* the
animation. This is the only considered direction that leaves LCP untouched, which
matters on a portfolio whose pitch is engineering.

## Design

### Timeline

Three phases, one rAF loop:

```
hydrate ──── cruise ──────────── decelerate ──────── rest
  t0        constant velocity    --duration-scene     │
            while not ready      (1.1s, expo.out)     └─▶ existing scroll-driven
                                                          marquee resumes
```

`tDecel = clamp(tReady, 0.25s, duration.loader)`

- **Floor (0.25s)** — a warm cache must not jump-cut; there is always a settle.
- **Ceiling (2.0s)** — the existing `duration.loader` token, finally used as the
  cap its comment describes.
- **`tReady`** is real: `document.fonts.ready` **and** the portrait's
  `img.decode()`. No timer stands in for progress.

Beats:

| t | Element | From → To | Token |
|---|---|---|---|
| `0 → tDecel` | marquee | cruise, constant velocity | — |
| `tDecel` | marquee | decelerate to register-locked rest | `--duration-scene`, `--ease-out` |
| `tDecel + 0.12s` | portrait | `blur(12px)→0`, `saturate(0.4)→1`, `translateY(2.5%)→0` | `--duration-scene`, `--ease-out` |
| `tDecel + 1.1s` | chrome (pill, role, arrow) | fade + 8px rise | `--duration-base`, `--ease-out` |

Type leads; the portrait follows; chrome lands last.

### The portrait resolves — it is never masked

An earlier iteration had the portrait revealed by a base-anchored mask. **Rejected.**
The portrait is `priority` and is the LCP element (`Hero.tsx:85`), deliberately
SSR'd into the initial paint. A mask means it is not fully painted until the settle
ends, so a slow connection would push LCP out by up to 2s — precisely the cost this
direction exists to avoid.

Instead it is painted whole at first frame and resolves in place via `filter` and a
small `translateY`. A blurred image still counts as painted, so LCP fires on the
first frame. Same gesture, no cost.

Implemented as **CSS transitions keyed off a `data-state` attribute** on the
section (`"settling"` → `"rest"`). No JS animates the portrait or the chrome.

### Register lock

The marquee strip is repeated identical units, so any whole-unit travel lands in
the same visual phase. The settle's distance is **quantized to a whole number of
marquee units**, which makes the resting composition identical on every load — the
name always comes to rest in its designed frame, never a random phase.

Unit width is measured from a single `.word` span, not derived from
`scrollWidth / 2` (`Hero.tsx:39`). The pattern repeats every *unit*, not every
half-strip, so `% unitW` is equally seamless and keeps the numbers an order of
magnitude smaller.

Handoff is free: the scroll handler is relative (`pos += delta`), so it resumes
from wherever the settle stopped. No jump, and one loop rather than two.

**This deletes a hack.** `Hero.tsx:58` currently does `setTimeout(measure, 400)`
to "re-measure once web fonts land". `document.fonts.ready` is the actual signal,
and the entrance needs it regardless.

### The smear — offset misregistration

A blur on 20rem type is expensive and reads foggy rather than fast. Instead: **two
ghost copies of the track**, offset opposite to travel, with offset and opacity
both scaled by current velocity, and removed from the DOM entirely at rest. Pure
transform + opacity — compositor-only, no filter cost — and they fill the gap
between frames so a fast sweep reads as a smear rather than a strobe.

The ghosts are tinted **`--signal`** and **`--ember`**. This is CMYK plate
misregistration on a press: a typographic idea, not a shader effect. The
Signal/Ember duality appears for 1.1 seconds in the first moment of the site, then
resolves into a single charcoal name as the plates come into register. Because it
is transient it does not spend the "one accent moment per viewport" rule
(BUILD_GUIDE §6).

*Reversible:* dropping the tint to neutral grey is a two-token change.

### Deliberate omissions

- **No `sessionStorage` "seen" flag.** M3 specced one to avoid re-playing a
  *blocking* screen. This is not one — it is 1.1s of the hero's own motion — so
  replaying it every load costs nothing and stays consistent.
- **No scroll lock.** Scroll deltas add to the same `pos` the settle drives, so
  scrolling during the entrance is harmless. Locking Lenis is the bug already open
  against `MenuOverlay`; a second instance will not be introduced.
- **Below-fold sections are out of scope.** Wiring `motion/Reveal` and
  `motion/SplitText` into the section reveals is a separate tracked follow-up.

### Reduced motion

`useReducedMotion` → rest state at `t0`: no transform, no filters, no ghosts,
chrome visible. Mirrors the early return already at `Hero.tsx:28`.

## Structure

| File | Change |
|---|---|
| `src/hooks/useSiteReady.ts` | **new** — resolves on `document.fonts.ready` + portrait decode, capped at `duration.loader` |
| `src/components/sections/hero/useHeroEntrance.ts` | **new** — the rAF loop: cruise → decelerate → hand off to scroll |
| `src/components/sections/hero/Hero.tsx` | the existing marquee effect **moves into** the hook; renders ghosts, wires `data-state` |
| `src/components/sections/hero/Hero.module.css` | develop + chrome transitions, ghost layers |
| `src/styles/tokens.css` | entrance tokens (blur, saturate, rise, ghost opacity) |

`useSiteReady` has one purpose and no knowledge of the hero. `useHeroEntrance`
owns all marquee motion — entrance and scroll — so there is exactly one rAF loop
touching `pos`. `Hero.tsx` returns to being presentational.

Every new magnitude gets a token. The golden rule admits no `12px` inline.

## Verification

Playwright is installed but has no config and no tests; this adds both. Three
assertions, chosen because the register lock is the one invariant that will
regress silently:

1. Under `prefers-reduced-motion: reduce`, the track carries no transform and the
   portrait no filter at first paint.
2. After the settle, the track's transform is an exact multiple of the measured
   unit width.
3. The LCP element is still the portrait, and no element covers it.

## Risks

- **Unit width measured before fonts load** gives a wrong rest frame. Mitigated by
  gating measurement on `document.fonts.ready` — the same signal that replaces the
  400ms hack.
- **Ghost tint reads as gimmick** rather than misregistration. Contained: two
  tokens revert it to neutral.
- **Cruise velocity tuning** is font-metric dependent and can only be settled
  against the real rendering; the spec fixes the model, not the constant.

## Out of scope

Route transitions, the below-fold section reveals, the WebGL beat from M3, any
change to `Intro` or later sections, and the hero's copy or photography.
