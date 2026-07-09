# BUILD GUIDE · The Nexus

Engineering handbook for building and maintaining the portfolio. Read this before
writing code. It defines *how* we build so the codebase stays consistent, fast, and
maintainable. For *what* to build and *why*, see `04-ARCHITECTURE.md`,
`03-DESIGN-SYSTEM.md`, `02-STRATEGY.md`, and `01-RESEARCH.md`.

---

## 1 · Philosophy & Golden Rules

1. **The site is the portfolio piece.** Every technical decision is a craft
   decision. Sloppy code is a design flaw.
2. **Tokens are law.** Colors, spacing, type, and motion come from a single source
   of truth (`styles/tokens.css`, `lib/motion.ts`). Never hard-code a hex, a pixel
   gap, or a `0.3s` inline.
3. **Weight over speed.** Reveals are slow and eased (`expo.out`, 600–1100ms). Only
   micro-feedback (hover/cursor) is fast (≤250ms).
4. **Accessible and fast by default.** `prefers-reduced-motion`, keyboard, and
   performance budgets are not a final phase — they're wired in from primitive one.
5. **Small, typed, single-responsibility.** Primitives → patterns → sections →
   pages. If a component does two things, split it.
6. **Server by default, client on purpose.** RSC unless the component needs the
   browser (WebGL, scroll, cursor, state). Then `dynamic({ ssr:false })`.

---

## 2 · Overall Architecture

- **Framework:** Next.js 15, App Router, React Server Components, TypeScript strict.
- **Rendering:** static generation for Home / Work / About / case studies; browser-
  only features hydrate as isolated client islands.
- **Styling:** CSS custom properties (source of truth) + your chosen layer
  (Tailwind v4 `@theme` **or** CSS Modules — pick one, see §6).
- **3D:** React Three Fiber + drei, isolated under `webgl/`, one shared canvas,
  lazy-loaded, always with a poster fallback.
- **Motion:** GSAP + ScrollTrigger for scroll/timeline; Lenis for smooth scroll;
  Framer Motion for component enter/exit and page transitions. All timings from
  `lib/motion.ts`.
- **State:** Zustand, minimal, sliced (`ui`, `cursor`, `scroll`, `webgl`, `loader`).
- **Content:** typed local content in `content/` (MDX or TS); graduate to a CMS only
  if editing frequency demands it.
- **Hosting:** Vercel (preview + prod), analytics + speed insights.

Data flow: `content/` (typed) → page (RSC) → sections (props) → primitives. Motion
and WebGL read from Zustand/providers, never from content.

---

## 3 · Folder Structure & Where Things Go

See `04-ARCHITECTURE.md · Part C` for the full tree. Decision rules:

- **A pure, reusable visual element** (Button, Chip) → `components/ui/`.
- **Reusable behavior that wraps children** (Reveal, MagneticButton) →
  `components/motion/`.
- **A page-specific composition** (Hero, WorkList) → `components/sections/`.
- **Anything touching Three.js** → `webgl/` (never import `three` into DOM
  components).
- **Cross-cutting logic** (gsap setup, lenis, store, motion tokens, utils) → `lib/`.
- **Reusable React logic** (`useMediaQuery`) → `hooks/`.
- **Design tokens / global CSS** → `styles/`.
- **Copy, projects, config** → `content/`.
- **Types** → `types/` (or colocated when tiny).

Rule of thumb: **if two features import it, it moves up** (into `ui`, `lib`, or
`hooks`). If only one page uses it, keep it local.

---

## 4 · Component Responsibilities

| Layer | Owns | Never does |
|---|---|---|
| **Primitives (`ui`)** | Appearance, variants, states, a11y of one element | Business logic, data fetching, scroll/3D |
| **Motion primitives (`motion`)** | Animation behavior + reduced-motion handling | Visual styling of content, layout decisions |
| **Patterns (`project`, `layout`)** | Composed, reusable structures (cards, header) | Page assembly, metadata |
| **Sections (`sections`)** | One page section, composed from primitives; takes typed props | Global providers, routing |
| **WebGL (`webgl`)** | Scenes, materials, shaders, perf guards, fallbacks | DOM layout, content |
| **Pages (`app`)** | Assemble sections, set metadata, fetch content | Layout logic, animation internals |

**Contract:** a component handles its own states (hover/focus/active/disabled),
its own reduced-motion behavior, and its own teardown. Consumers shouldn't need to
know its internals.

---

## 5 · Animation Implementation

> All durations/easings/staggers/lerps import from `lib/motion.ts`. No magic numbers.

### 5.1 GSAP setup & the context/cleanup rule
Register plugins once (`lib/gsap.ts`). **Every** GSAP usage is scoped with a context
and cleaned up on unmount — this prevents leaks, duplicate triggers, and post-
navigation ghosts.

```tsx
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";   // handles context + cleanup
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { duration, ease, stagger } from "@/lib/motion";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export function RevealLines({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLElement>(".line-inner");
    gsap.from(lines, {
      yPercent: 110,
      duration: duration.slow,
      ease: "expo.out",           // matches ease.out token
      stagger: stagger.base,
      scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
    });
  }, { scope: root });            // ← scoped; auto-reverts on unmount
  return <div ref={root}>{children}</div>;
}
```

### 5.2 Lenis smooth scroll (synced to ScrollTrigger)
One provider at the root. Drive Lenis from GSAP's ticker and update ScrollTrigger on
scroll. **Disable under reduced-motion.**

```tsx
"use client";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect } from "react";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;                       // native scroll for reduced-motion
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); };
  }, [reduced]);
  return <>{children}</>;
}
```

### 5.3 SplitText (line/word reveal)
Wrap lines/words in `overflow:hidden` masks and translate the inner element.
Provide a plain fallback when reduced-motion is on (render text as-is, no split).

### 5.4 Magnetic button
RAF-driven lerp toward the cursor within a threshold; reset on leave; **skipped on
touch and reduced-motion** (renders a normal button).

```tsx
// pseudo: on mousemove within radius →
// target = (pointer - center) * strength; current += (target - current) * lerp.magnetic;
// apply transform: translate(current). Always guard: if (isTouch || reduced) return <button/>;
```

### 5.5 Custom cursor
A single fixed element following the pointer via lerp (`lerp.cursor`). State
(default / hover-link / hover-media / hold) lives in Zustand; interactives set it on
enter/leave. `aria-hidden`; unmounted (or `display:none`) on touch + reduced-motion;
native cursor restored.

### 5.6 Page transitions
Use a route `template.tsx` with Framer `AnimatePresence` (exit → enter, `duration.scene`)
**or** a GSAP overlay wipe. Keep transitions short enough not to feel sluggish;
ensure focus and scroll reset correctly after navigation. No hard reloads.

### 5.7 Reveal-on-scroll convention
Prefer the `Reveal` motion primitive over ad-hoc ScrollTriggers in sections. It
standardizes: start opacity/translate, `once: true`, `start: "top 85%"`,
`duration.slow`, `ease.out`, and reduced-motion → instant.

### 5.8 Motion do/don't
- ✅ Animate `transform` and `opacity` only in hot paths.
- ✅ `once: true` for content reveals; kill off-screen loops.
- ✅ One "peak" per viewport.
- ❌ Never animate `width/height/top/left` or filters in scroll paths.
- ❌ Never hard-code durations/easings — import tokens.
- ❌ Never ship an animation without a reduced-motion path.

---

## 6 · Design Principles in Code

- **Consume tokens, never literals.** `color: var(--bone)` / `gap: var(--space-5)` /
  `font: var(--fs-h2)…`. If a needed value doesn't exist, add a token — don't inline.
- **Hierarchy by voice + weight + color**, not size alone (mono eyebrow → display
  headline → sans body).
- **The duality is structural:** use Signal for the build/code axis (links, focus,
  "Build" blocks) and Ember for the craft/design axis (primary CTAs, "Craft"
  blocks). One accent moment per viewport max.
- **Surface layering for depth:** ink → elevated → raised with hairline `--line`
  borders; sections should feel like distinct spaces.
- **Compose every screen:** few elements, large type, deliberate negative space
  (`--section-y` rhythm on the 8px grid).
- **Styling paradigm — pick one:**
  - *Tailwind v4:* map tokens in `@theme`; utilities for layout; component CSS for
    bespoke/animated parts. Keep class lists readable (extract when long).
  - *CSS Modules:* one `.module.css` per component; BEM-ish local names; tokens via
    vars. Preferred for the hand-crafted, studio feel.
  - Do **not** mix both paradigms in the same codebase.

---

## 7 · Coding Conventions

- **TypeScript strict.** No `any` (use `unknown` + narrowing). Explicit return types
  on exported functions. Model content with real types (`types/Project`).
- **Components:** function components; named exports for components, default export
  only for Next route files. Props interface named `XxxProps`.
- **Server vs client:** default to server. Add `"use client"` only when using state,
  effects, browser APIs, GSAP/Lenis/Framer, or WebGL. Keep client islands small and
  push them down the tree.
- **Imports:** absolute via aliases (`@/components/ui/Button`). Group: external →
  internal → styles. No deep relative `../../../`.
- **Hooks:** prefix `use`; one concern each; return typed values.
- **No dead code / no commented-out blocks** committed. Delete; git remembers.
- **Comments explain *why*, not *what*.** Name things so the *what* is obvious.
- **Errors & edge states:** every async path handles loading + error; every list
  handles empty; every form handles failure.
- **Accessibility is part of "done":** a component isn't complete until it's
  keyboard-usable, focus-visible, labeled, and reduced-motion-safe.

### 7.1 Naming conventions
| Thing | Convention | Example |
|---|---|---|
| Component file & component | `PascalCase` | `ProjectRow.tsx` → `ProjectRow` |
| Hook | `camelCase` `use…` | `useReducedMotion.ts` |
| Util / non-component lib | `camelCase` | `mapRange.ts`, `motion.ts` |
| Type / interface | `PascalCase` | `Project`, `SiteConfig`, `ButtonProps` |
| CSS custom property | `--kebab-case`, grouped by role | `--ink-elevated`, `--fs-display-xl` |
| CSS Module class | `camelCase` local | `.rowInner`, `.isActive` |
| Zustand slice | `camelCase` | `useUIStore`, `useCursorStore` |
| Content slug | `kebab-case` | `fabric-vc`, `project-parallax` |
| Boolean prop/var | `is/has/should` prefix | `isActive`, `hasPreview` |
| Shader uniform | `u` prefix | `uMix`, `uPointer`, `uProgress` |
| Constant | `UPPER_SNAKE` | `MAX_DPR`, `PARTICLE_COUNT` |

### 7.2 Git & commits
- Branch per feature: `feat/hero-webgl`, `fix/menu-scroll-lock`.
- **Conventional Commits:** `feat:`, `fix:`, `perf:`, `refactor:`, `style:`,
  `docs:`, `chore:`. Small, focused commits.
- PRs are small and preview-deployed; lint/type/format must pass (Husky + lint-staged
  gate on commit). Update `TASKS.md` checkboxes in the PR.

---

## 8 · Performance Guidelines

Budgets (enforce; see `TASKS.md · Performance`): Lighthouse mobile Perf ≥ 90,
LCP < 2.5s, INP < 200ms, CLS < 0.05, initial route JS < ~180KB gzip excluding the
per-page WebGL chunk.

- **RSC first;** `dynamic(() => import(...), { ssr:false })` for WebGL, cursor, and
  other browser-only islands.
- **Fonts:** self-host via `next/font/local`, subset weights, preload the hero's
  critical faces to prevent FOUT/CLS.
- **Images:** `next/image` only; AVIF/WebP; explicit `sizes`; blur placeholders;
  lazy below the fold; pre-size case-study media.
- **Video:** `poster` + `preload="none"`; play muted-loop only when in view
  (IntersectionObserver).
- **3D:** single canvas; `dpr={[1, MAX_DPR]}`; drei `AdaptiveDpr` +
  `PerformanceMonitor` to drop quality on weak GPUs; scale particle count by device
  tier; Draco glTF + KTX2 textures; **dispose** geometries/materials/textures on
  unmount; pause `frameloop` when off-screen; ship a poster to mobile/save-data.
- **Bundle hygiene:** import only what you use (tree-shake drei/lodash); avoid heavy
  deps; check the bundle analyzer before adding a library.
- **Rendering hot paths:** animate only `transform`/`opacity`; `content-visibility:
  auto` on long pages; memoize expensive renders; keep RAF loops off when unseen.
- **Measure, don't guess:** Lighthouse + WebPageTest + Speed Insights on real
  devices (especially mid-tier Android + iOS Safari) before shipping.

---

## 9 · Responsive Design Strategy

- **Mobile-first.** Author base styles for small screens; enhance up via min-width
  breakpoints (`--bp-sm…2xl`). Design at **375 / 768 / 1440**, verify **320** (no
  h-scroll) and **1920** (type maxes via `clamp`, no over-stretch).
- **Fluid by default:** `clamp()` type scale + fluid `--section-y`, `--container-pad`,
  `--gutter` mean most things scale without breakpoint churn. Use breakpoints for
  *layout* changes (columns, nav), not for resizing type.
- **Touch is a first-class mode, not a fallback:**
  - Disable custom cursor, magnetic effects, and cursor-follow previews on touch;
    replace with static thumbnails/tap states.
  - Tap targets ≥ 44×44px; adequate spacing.
  - Reduce WebGL cost (fewer particles or poster) on mobile; never ship the full
    desktop particle load to a budget phone.
  - Test real iOS Safari (viewport units, `100dvh`, WebGL quirks, momentum scroll).
- **Reduced-motion & save-data** are parallel "modes" alongside breakpoints — every
  section must look intentional in each.
- **Content priority:** on small screens, lead with the answer (who/what/proof);
  defer decorative motion; stack columns in reading order.

---

## 10 · Deployment Process

1. **Environments:** Vercel with automatic **preview deploys** per PR and
   **production** on `main`. Never push straight to prod for features.
2. **Env vars:** set form-provider keys (Resend/Formspree) and analytics IDs in
   Vercel project settings (preview + prod). Never commit secrets.
3. **CI gate before merge:** typecheck, ESLint, Prettier check, build. Add a
   Lighthouse/axe check on preview URLs; block merges that regress budgets or a11y.
4. **Pre-launch checklist (see `TASKS.md · Deployment`):** cross-browser matrix
   (incl. iOS Safari WebGL fallback), responsive at all anchors, metadata/OG/JSON-LD,
   sitemap/robots, analytics live.
5. **Domain & redirects:** attach custom domain + HTTPS; apex/`www` redirect; add
   **301s from old portfolio URLs** so nothing 404s or loses SEO.
6. **Post-launch:** submit `sitemap.xml` to Search Console; watch Speed Insights and
   Vercel Analytics for real-user CWV; tag a release.
7. **Rollback:** Vercel keeps immutable deployments — promote a previous deployment
   instantly if a regression ships.

### 10.1 Local scripts (expected in `package.json`)
```
dev        next dev
build      next build
start      next start
lint       next lint
typecheck  tsc --noEmit
format     prettier --write .
analyze    ANALYZE=true next build   # bundle analyzer
```

---

## 11 · Definition of Done (per feature)

A feature is done when **all** are true:
- [ ] Uses tokens (no hard-coded color/space/type/duration).
- [ ] Server/client split is correct; client island is minimal.
- [ ] Keyboard-operable; `:focus-visible` present; labeled for AT.
- [ ] Reduced-motion path implemented and verified.
- [ ] Works at 375 / 768 / 1440 (and doesn't break at 320 / 1920).
- [ ] Touch behavior handled (no cursor-dependent interaction required).
- [ ] No console errors/warnings; no leaks (GSAP/WebGL torn down).
- [ ] Within performance budget; only transform/opacity animated in hot paths.
- [ ] Typed (no `any`); lint/format/build pass.
- [ ] `TASKS.md` updated.

---

_This guide is living documentation. When a convention changes, update it here first,
then the code. Consistency is the feature._
