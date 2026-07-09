# 03 · Visual Design System & Motion Guide

> These are concrete, buildable tokens. Copy the CSS/TS blocks directly into the
> repo. The system is **dark-first** with an optional light surface. The organizing
> idea is the **duality**: a cool accent (**Signal** — code/build) and a warm accent
> (**Ember** — craft/design) that "meet at the nexus."

---

## Part A — Color System

### A.1 Palette rationale
Not pure black. A near-black **ink** with a hair of blue reads more premium and is
kinder to the eye than `#000`. Text is a warm off-white (**bone**), not `#fff`, to
reduce glare and add character. Two accents encode the brand duality and are used
*sparingly* — accents earn their impact by being rare.

### A.2 Tokens (`styles/tokens.css`)

```css
:root {
  /* ─── Ink (backgrounds, dark-first) ─── */
  --ink:            #0B0B0E;   /* base background */
  --ink-elevated:   #131318;   /* cards, elevated surfaces */
  --ink-raised:     #1C1C22;   /* modals, menu, popovers */
  --ink-hover:      #232329;   /* interactive hover fill */

  /* ─── Bone (text / foreground) ─── */
  --bone:           #ECECE6;   /* primary text */
  --bone-muted:     #9A9AA2;   /* secondary text, captions */
  --bone-subtle:    #62626B;   /* meta, disabled, mono labels */

  /* ─── Accents (the duality) ─── */
  --signal:         #5B8CFF;   /* COOL — code/build axis: links, focus, tech highlights */
  --signal-dim:     #3A63C9;
  --ember:          #FF6B4A;   /* WARM — craft/design axis: primary CTA, hover energy */
  --ember-dim:      #D94E32;

  /* ─── Lines & surfaces ─── */
  --line:           rgba(236,236,230,0.08);   /* hairline borders */
  --line-strong:    rgba(236,236,230,0.16);
  --overlay:        rgba(11,11,14,0.72);       /* scrims */
  --glass:          rgba(28,28,34,0.60);       /* frosted panels (+ backdrop-blur) */

  /* ─── Semantic ─── */
  --success:        #4ADE80;
  --warning:        #FBBF24;
  --error:          #F87171;
  --info:           var(--signal);

  /* ─── Focus ─── */
  --focus-ring:     2px solid var(--signal);
  --focus-offset:   2px;
}

/* Optional LIGHT surface (mode toggle, or light sections/case studies) */
[data-theme="light"] {
  --ink:            #F4F3EE;
  --ink-elevated:   #FFFFFF;
  --ink-raised:     #FFFFFF;
  --ink-hover:      #ECEBE4;
  --bone:           #14141A;
  --bone-muted:     #4B4B54;
  --bone-subtle:    #86868E;
  --line:           rgba(20,20,26,0.10);
  --line-strong:    rgba(20,20,26,0.20);
  --overlay:        rgba(244,243,238,0.72);
  --glass:          rgba(255,255,255,0.60);
  /* accents stay identical — they anchor the brand across themes */
}
```

### A.3 Usage rules
- **Signal (cool)**: links, focus rings, the "Build" column/label, technical
  metadata highlights, the *cool* half of the hero object.
- **Ember (warm)**: primary CTA buttons, the "Craft" column/label, hover energy,
  the *warm* half of the hero object, the loader gradient's warm end.
- **Never** put Ember on Signal (or vice-versa) as fill+text — pair each with
  ink/bone.
- **Accent budget:** at most one accent moment per viewport. If two want to appear,
  demote one to bone.
- **Contrast (must hold):** body text (`--bone` on `--ink`) ≈ 15:1 — pass. Muted
  text (`--bone-muted` on `--ink`) ≈ 6.7:1 — pass AA. `--bone-subtle` is for
  ≥18px/large or non-essential meta only (≈ 3.6:1). Accents on ink pass AA for
  large text; for small text on accents, use ink as the foreground.

---

## Part B — Typography

### B.1 Font pairing (three voices = the duality + a neutral)

| Role | Font | Why | Source |
|---|---|---|---|
| **Display / headings** | **Clash Display** (alt: PP Neue Montreal) | Expressive, modern, geometric — the "designer" voice. | Fontshare (free, commercial OK) |
| **Body / UI** | **General Sans** (alt: Inter) | Neutral, legible, quietly technical — connective tissue. | Fontshare / Google |
| **Mono / meta** | **JetBrains Mono** (alt: Geist Mono) | The "engineer's hand" — indices, tags, coordinates, code. | Google / Vercel |

Self-host all three (`next/font/local`) for zero layout shift and no third-party
request. Subset to the weights you use (Display 400/500/600; Sans 400/500;
Mono 400/500).

### B.2 Type scale (fluid, `clamp()`)

```css
:root {
  --font-display: "Clash Display", "PP Neue Montreal", system-ui, sans-serif;
  --font-sans:    "General Sans", "Inter", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", "Geist Mono", ui-monospace, monospace;

  /* Display / headings (min, preferred, max) */
  --fs-display-xl: clamp(3.25rem, 8.5vw, 9rem);    /* hero */
  --fs-display-l:  clamp(2.5rem, 6vw, 5.5rem);     /* section statements */
  --fs-h1:         clamp(2rem, 4.2vw, 3.5rem);
  --fs-h2:         clamp(1.6rem, 3vw, 2.5rem);
  --fs-h3:         clamp(1.35rem, 2vw, 1.75rem);

  /* Body */
  --fs-body-l:     clamp(1.125rem, 1.4vw, 1.375rem);
  --fs-body:       1rem;        /* 16px min — never smaller for paragraphs */
  --fs-small:      0.875rem;

  /* Mono meta */
  --fs-mono:       0.8125rem;   /* 13px, uppercase, tracked */

  /* Line heights */
  --lh-tight:      0.95;        /* display */
  --lh-snug:       1.1;         /* headings */
  --lh-normal:     1.5;         /* body */
  --lh-relaxed:    1.65;        /* long-form case-study prose */

  /* Letter spacing */
  --ls-display:   -0.02em;      /* tighten large display */
  --ls-tight:     -0.01em;
  --ls-normal:     0;
  --ls-mono:       0.08em;      /* open up mono labels */
}
```

### B.3 Type role definitions

```css
.display-xl { font: 500 var(--fs-display-xl)/var(--lh-tight) var(--font-display);
              letter-spacing: var(--ls-display); }
.display-l  { font: 500 var(--fs-display-l)/var(--lh-snug) var(--font-display);
              letter-spacing: var(--ls-display); }
.h1 { font: 500 var(--fs-h1)/var(--lh-snug) var(--font-display); letter-spacing: var(--ls-tight); }
.h2 { font: 500 var(--fs-h2)/var(--lh-snug) var(--font-display); }
.h3 { font: 500 var(--fs-h3)/1.2 var(--font-sans); }
.body-l { font: 400 var(--fs-body-l)/var(--lh-relaxed) var(--font-sans); }
.body   { font: 400 var(--fs-body)/var(--lh-normal) var(--font-sans); }
.small  { font: 400 var(--fs-small)/1.4 var(--font-sans); color: var(--bone-muted); }
.mono   { font: 500 var(--fs-mono)/1 var(--font-mono);
          letter-spacing: var(--ls-mono); text-transform: uppercase; color: var(--bone-subtle); }
```

### B.4 Typography rules
- **Hierarchy by voice + weight + color**, not size alone. A mono eyebrow + display
  headline + sans body is your default triad.
- **Measure:** long-form prose caps at ~68ch for readability.
- **Numerals:** use tabular figures (`font-feature-settings: "tnum"`) in metadata,
  timelines, counters, and stats so they don't jitter during animation.
- **Never** all-caps the display face for long strings; reserve caps for mono meta
  and short labels.

---

## Part C — Spacing, Grid & Layout

### C.1 Spacing scale (8px base)

```css
:root {
  --space-1: 0.25rem;  /*  4 */
  --space-2: 0.5rem;   /*  8 */
  --space-3: 0.75rem;  /* 12 */
  --space-4: 1rem;     /* 16 */
  --space-5: 1.5rem;   /* 24 */
  --space-6: 2rem;     /* 32 */
  --space-7: 3rem;     /* 48 */
  --space-8: 4rem;     /* 64 */
  --space-9: 6rem;     /* 96 */
  --space-10: 8rem;    /* 128 */
  --space-11: 12rem;   /* 192 */

  /* Fluid section rhythm — the vertical "beat" between major sections */
  --section-y: clamp(5rem, 12vh, 11rem);

  /* Container + gutters */
  --container-max: 90rem;   /* 1440px content ceiling */
  --container-pad: clamp(1.25rem, 5vw, 5rem);  /* page side padding */
  --gutter: clamp(1rem, 2vw, 1.5rem);          /* grid gutter */
}
```

### C.2 Grid

- **12-column** fluid grid inside `--container-max`, gutter `--gutter`, side padding
  `--container-pad`.
- **Bleed option:** a `.bleed` utility that breaks out to full viewport width for
  hero canvases and full-bleed case-study images.
- **Baseline discipline:** vertical rhythm snaps to the 8px scale; major sections
  separated by `--section-y`. This is the fix for the "eyeballed spacing" audit
  finding.

```css
.container { width: 100%; max-width: var(--container-max);
             margin-inline: auto; padding-inline: var(--container-pad); }
.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--gutter); }
.bleed { width: 100vw; margin-inline: calc(50% - 50vw); }
.section { padding-block: var(--section-y); }
```

### C.3 Breakpoints

```css
/* mobile-first; values are min-widths */
--bp-sm:  30rem;   /* 480  — large phone */
--bp-md:  48rem;   /* 768  — tablet */
--bp-lg:  64rem;   /* 1024 — laptop */
--bp-xl:  80rem;   /* 1280 — desktop */
--bp-2xl: 96rem;   /* 1536 — wide */
```
Design at 3 anchor widths: **375** (phone), **768** (tablet), **1440** (desktop).
Verify at 320 (no h-scroll) and 1920 (no over-stretch; type maxes out via clamp).

### C.4 Radii, elevation, misc

```css
--radius-sm: 6px;  --radius-md: 12px;  --radius-lg: 20px;  --radius-full: 999px;
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 8px 30px rgba(0,0,0,0.35);
--shadow-glow-ember:  0 0 40px rgba(255,107,74,0.25);
--shadow-glow-signal: 0 0 40px rgba(91,140,255,0.25);
--blur-glass: 12px;   /* backdrop-filter for frosted panels */
--z-cursor: 9999; --z-menu: 900; --z-header: 800; --z-scrim: 700;
```

---

## Part D — Components (full spec)

Each component: purpose, variants, states, key tokens. Build them as typed React
components in `components/ui`. States always include **hover / focus-visible /
active / disabled**, and respect `prefers-reduced-motion`.

### D.1 Button
- **Variants:** `primary` (Ember fill, ink text), `secondary` (outline, `--line-strong`),
  `ghost` (text + mono label), `icon`.
- **Sizes:** `sm` (36px h), `md` (44px h — default, touch-safe), `lg` (56px h).
- **States:** hover → fill lift + `--shadow-glow-ember`; focus-visible → `--focus-ring`;
  active → 0.98 scale; disabled → 0.4 opacity, no pointer.
- **Motion:** magnetic on desktop (translate toward cursor within a ~40px radius,
  lerp 0.15) + label/arrow micro-shift; **disabled on touch & reduced-motion**.

### D.2 Link (text)
- Inline: `--signal` color, custom underline that sweeps in on hover (Ember or bone,
  scaleX 0→1 from left, 300ms expo). Nav links get an index (`01`) in mono.

### D.3 Nav / Header
- Sticky-transparent → gains `--glass` background + blur after scrolling past hero.
- Wordmark left (`NEXUS ◆`), Menu trigger right (animated hamburger→"MENU" or 2-line
  morph). Optional availability pill (Ember dot, mono text).

### D.4 Overlay Menu
- Full-screen `--ink-raised`, masked reveal (clip-path from edge, 600–800ms).
- Large link list (display), staggered entrance (60ms/item), magnetic, hover →
  destination preview panel. Locks body scroll, traps focus, ESC to close.

### D.5 Project Card (grid, `/work`)
- Structure: media (16:10 or 4:3), title (h3), meta row (mono: year · discipline),
  arrow. Hover → image scale 1→1.05 (600ms expo, `overflow:hidden`), title
  translate, accent underline. Optional WebGL hover-distortion (see F.4).

### D.6 Project Row (list, Home)
- Full-width row: index (mono) · title (display) · meta · arrow. Hover summons a
  cursor-following preview (image/video/scene) + row lift + underline sweep.
  **Mobile:** static thumbnail card, no cursor-follow.

### D.7 Badge / Chip
- **Badge:** small mono label with dot (status: `Available` = success dot;
  `2025` = neutral). Pill radius, `--ink-elevated` bg, `--line` border.
- **Chip (skills):** interactive; grouped by axis (Design=Ember tint,
  Frontend/WebGL=Signal tint, Tooling=neutral). Hover → border brighten + tiny lift.

### D.8 Form (contact)
- Fields: floating mono labels, `--ink-elevated` fill, `--line` border → `--signal`
  on focus. Underline-style inputs also acceptable for the editorial look.
- Validation: inline, `--error` text + border; success = `--success`.
- Submit: `primary` button with loading (label → spinner) and success states.
- **A11y:** real `<label for>`, `aria-describedby` for errors, `aria-live="polite"`
  status region, visible focus, no color-only error signaling.
- **Note:** in React artifacts avoid `<form>`; in the real Next app, use a proper
  `<form>` with progressive enhancement + a server action or API route.

### D.9 Modal / Dialog (case-study lightbox, playground fullscreen)
- `--overlay` scrim + `--ink-raised` panel, masked scale-in (0.96→1, 400ms).
- Focus trap, ESC close, scroll lock, return focus to trigger on close.

### D.10 Timeline (About / experience)
- Vertical rail with nodes; each entry: mono year-range · role (h3) · org · one line.
- Nodes light up (Signal) as they scroll into view; rail draws in via `scaleY`.

### D.11 Marquee (playground / tech ticker)
- Infinite horizontal loop (transform-based, GPU); pauses on hover; slows under
  reduced-motion (or becomes static). Used for tech tags or looping demo tiles.

### D.12 Case-study content blocks (reusable)
`FullBleedImage` · `TwoUp` (side-by-side media) · `Detail` (zoomed crop + caption) ·
`PullQuote` (display, accent mark) · `StackList` (mono tech grid) ·
`CodeSnippet` (mono, syntax-tinted, copy button) · `MetricRow` (big tabular
numbers + label) · `VideoBlock` (poster + lazy autoplay-muted-loop). These compose
every case study, keeping content authoring consistent.

### D.13 Footer
- Big CTA line (display), nav repeat (mono indices), socials, colophon (`Built with
  Next.js · R3F · GSAP`), © + year + locale + a small live clock (engineer texture).

### D.14 Custom Cursor
- Dot (`--bone`) + ring; ring lerp-follows (factor ~0.12). States: default,
  `hover-link` (ring grows), `hover-media` (ring → label "VIEW"), `drag`/`hold`.
  Hidden from AT (`aria-hidden`), **disabled on touch and reduced-motion** (native
  cursor restored).

### D.15 Scroll Progress
- Thin fixed bar (Ember→Signal gradient) mapped to scroll; + current-section label
  in mono. Subtle; never competes with content.

---

## Part E — Motion System

> Motion is the biggest single upgrade from "template" to "senior." Everything is
> **tokenized** so timing is consistent and tunable in one place. Golden rule:
> **weight over speed** — reveals are slow and eased; only micro-feedback is fast.

### E.1 Easing curves (`lib/motion.ts`)

```ts
export const ease = {
  // Primary reveal curve — "easeOutExpo" feel. Confident, weighted settle.
  out:      [0.16, 1, 0.30, 1],
  // Entrances that also need a soft start
  inOut:    [0.65, 0, 0.35, 1],
  // Exits / dismissals — accelerate away
  in:       [0.40, 0, 1, 1],
  // Playful overshoot for small delight (use sparingly)
  back:     [0.34, 1.56, 0.64, 1],
} as const;

// GSAP equivalents: use "expo.out" / "power4.out" for reveals,
// "power2.inOut" for scrubs, "power3.in" for exits.

export const duration = {
  micro:  0.15,  // hover color/opacity
  fast:   0.25,  // hover transforms, cursor
  base:   0.5,   // standard element reveal
  slow:   0.8,   // section reveals, large type
  scene:  1.1,   // page/section transitions, hero handoff
  loader: 2.0,   // loader arc (asset-driven, this is the cap)
} as const;

export const stagger = {
  tight: 0.04,   // letters
  base:  0.06,   // words / list items
  loose: 0.1,    // cards / large blocks
} as const;

// Lerp factors for RAF-driven follow (cursor, magnetic, parallax)
export const lerp = { cursor: 0.12, magnetic: 0.15, parallax: 0.08 } as const;
```

### E.2 Scroll behavior
- **Smooth scroll:** Lenis site-wide, `lerp ≈ 0.1`, `smoothWheel: true`, synced to
  GSAP ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)` and driving
  Lenis from GSAP's ticker. **Disable smoothing under reduced-motion** (native
  scroll).
- **Scroll-triggered reveals:** elements start `opacity:0; translateY:24px` (or
  clip-mask) and animate to rest when ~15% in view, `duration.slow`, `ease.out`,
  fire **once**.
- **Parallax:** background/media layers move at 0.85–1.15× scroll speed via
  transform; subtle, never nauseating; capped and reduced on mobile.
- **Pinning:** reserve for one or two intentional case-study moments (e.g., a
  pinned "Craft→Build" transition), not everywhere.

### E.3 Reveal & text animation patterns
- **Line reveal (headlines):** wrap each line in an `overflow:hidden` mask; translate
  the line 110%→0 with `duration.slow`, `ease.out`, `stagger.base` between lines.
  Split via a SplitText utility (respect reduced-motion → show instantly).
- **Word reveal (statements):** stagger words `stagger.base`, small `y` + opacity.
- **Char reveal:** reserve for the wordmark/loader only (expensive, use rarely).
- **Media reveal:** clip-path/mask wipe + inner-image scale 1.1→1 (`duration.scene`).

### E.4 Hover & micro-interactions
- **Buttons:** magnetic pull (`lerp.magnetic`) + fill/glow + label shift
  (`duration.fast`).
- **Links:** underline sweep scaleX 0→1 (`duration.fast`, `ease.out`).
- **Cards:** image scale + title translate + accent underline (`duration.base`).
- **Cursor:** ring scale/label change on interactive hover (`duration.fast`).
- **All micro-feedback ≤ 250ms** so it feels instant; reveals stay slow.

### E.5 Loading sequence
1. Show wordmark (draw-in), start real asset/font/WebGL-ready tracking.
2. Mono counter 0→100 mapped to **actual** progress; Ember→Signal progress fill.
3. On 100%: mask-wipe exit (Ember→Signal sweep) revealing an already-warming hero.
4. Hero type performs line reveals immediately after.
- **Reduced-motion / repeat visits:** skip to a fast fade (store a "seen" flag to
  avoid re-playing the full loader every navigation within a session).

### E.6 Page & section transitions
- **Page (route) transitions:** on navigation, current view exits (mask/scale/opacity,
  `duration.scene`, `ease.in`); incoming view enters (`ease.out`). Implement with
  Next App Router + a transition layer (`framer-motion` `AnimatePresence` on a
  template, or a GSAP-driven overlay). No hard reloads — the "one continuous
  surface" feel.
- **Section transitions:** each major section reveals as a *space* — a masked panel
  or color/surface shift so you feel you've *entered* it, not just scrolled.

### E.7 Reduced-motion contract (non-negotiable)
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```
In JS: read `window.matchMedia('(prefers-reduced-motion: reduce)')` and, when true:
disable Lenis smoothing, custom cursor, magnetic effects, parallax, WebGL
auto-animation (render a static frame or poster), and collapse reveals to instant.

### E.8 Motion budget
- ≤ 1 "peak" moment per viewport.
- Animate only `transform` and `opacity` (compositor-friendly); avoid animating
  layout properties (width/height/top/left) or filters in hot paths.
- Kill/complete off-screen animations; don't run RAF loops the user can't see.

---

## Part F — WebGL / Three.js System

> WebGL is the *identity*, kept on a strict budget. **One hero scene + optional
> subtle hover-distortion + a Playground.** Never WebGL for its own sake.

### F.1 The signature "Nexus object" (hero)
- **Concept:** a form that visibly holds two states — a **warm particle cloud**
  (Ember, "craft") and a **cool structured lattice/wireframe** (Signal, "code") —
  that converge into one coherent object. Literal nexus.
- **Implementation:** GPU-driven point cloud or instanced geometry with a custom
  GLSL shader; a `uMix` uniform blends the two states; `uPointer` adds parallax/
  displacement toward the cursor; `uProgress` (scroll) disperses/settles on handoff.
- **Cost control:** single `<Canvas>`, `dpr={[1, 2]}`, `frameloop="demand"` or
  paused when off-screen (IntersectionObserver), particle count scaled by device,
  `powerPreference:"high-performance"` only where warranted.

### F.2 R3F setup (`webgl/Canvas.tsx`)
- Stack: `@react-three/fiber`, `@react-three/drei` (useTexture, Preload, AdaptiveDpr,
  PerformanceMonitor), optional `@react-three/postprocessing` (one subtle bloom max).
- `PerformanceMonitor` (drei) auto-drops quality (particle count / dpr / effects) if
  FPS sags — key to staying fast on weak GPUs.
- `<Suspense>` fallback = the static poster (also the reduced-motion/no-WebGL image).

### F.3 Fallbacks & guards
- **No WebGL / context lost:** render a pre-baked poster (a rendered still of the
  object). Detect via a WebGL support check; also handle `webglcontextlost`.
- **Reduced-motion:** render one static frame; no pointer/scroll animation.
- **Mobile / low-perf:** reduced particle count or the poster; never ship the full
  desktop particle load to a budget phone.
- **Battery/save-data:** respect `navigator.connection.saveData` → poster.

### F.4 Optional image hover-distortion (subtle)
- On `/work` cards, a light WebGL displacement/RGB-shift on hover. **Optional, off
  by default on mobile.** If it costs more than it adds, skip it — the CSS
  scale-hover already reads as premium.

### F.5 Playground scenes
- Self-contained demos (shaders, physics toys, generative art). Each: pause when
  off-screen, cap dpr, teardown on unmount (dispose geometries/materials/textures to
  avoid leaks). Fullscreen view on click.

### F.6 Asset pipeline for 3D
- Models: glTF + **Draco** compression; textures as **KTX2/Basis** where possible.
- Preload only the hero's assets on first load; lazy-load Playground scenes on
  route/interaction. Keep the initial WebGL payload small so the loader stays short.

---

## Part G — Design Tokens Summary (quick reference)

| Token group | Source of truth | Consumed by |
|---|---|---|
| Color | `styles/tokens.css` (CSS vars) | all CSS + inline styles + R3F uniforms |
| Type scale | `styles/tokens.css` + `styles/typography.css` | all text components |
| Spacing / grid | `styles/tokens.css` | layout components |
| Motion (curves/durations/stagger/lerp) | `lib/motion.ts` (TS) | Framer + GSAP + RAF hooks |
| Breakpoints | `styles/tokens.css` + a TS mirror in `lib/` | media queries + `useMediaQuery` |

Keep **one source of truth per token type** and import everywhere — this is what
makes the system maintainable and the motion feel consistent.

---

*Next: `04-ARCHITECTURE.md` — technical architecture, folder structure, and the
phased development roadmap.*
