# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js portfolio site for Newton Frank — a **fullstack developer & product
designer** (early-career; 2025 grad, two internships). A single route (`/`) with
a **light editorial aesthetic** (Snellenberg-style), on a dark-first token system.

The engineering handbook is `docs/rebuild/BUILD_GUIDE.md` — **read it before
writing code.** Its golden rule: *tokens are law* (never hard-code a colour,
space, type size, or duration). `docs/superpowers/specs/` holds a dated design
spec per change.

## Current State

This repo was **consolidated on 2026-07-13** (see the design audit and the
`portfolio-consolidation` memory). Until then it carried two parallel worlds — a
legacy homepage and an editorial `/preview`. The editorial build was **promoted
to `/`** and the legacy world deleted. What follows is verified against source.

- **The home is the editorial composition:** Hero → Intro → ProjectList →
  WorkGrid → Capabilities → Experience → Contact.
- **`page.tsx` is a server component.** Sections are `"use client"` islands that
  still SSR to static HTML, so the hero's name marquee (the LCP element) is in
  the initial paint — not gated behind a client-only dynamic import.
- **Theme:** light editorial. The page wrapper is `data-theme="light"`; the
  Contact section and the MenuOverlay flip to `data-theme="dark"` locally. The
  `<body>` stays on the `:root` (ink) tokens so overscroll gutters match the dark
  Contact close.
- **Stack:** Next 15 (App Router) · React 19 · TypeScript strict · CSS Modules +
  custom-property tokens · GSAP/ScrollTrigger + Lenis smooth scroll.
  **No three.js** — the R3F carousel was orphaned and removed. **No Tailwind**
  and **no Framer Motion** — Tailwind was never actually loaded (the only file
  using it, `not-found.tsx`, rendered unstyled), and Framer Motion had one
  caller, now plain CSS keyframes. PostCSS went with Tailwind.
- **Design system:** `styles/tokens.css` (Ink/Bone surfaces + the Signal/Ember
  duality), `lib/motion.ts` (durations, eases, stagger, lerp — mirrors the CSS).
  Fonts: self-hosted **Clash Display** (display) + **General Sans** (body) via
  `lib/fonts.ts`, plus **Anton** (condensed, menu only) and **JetBrains Mono**.

## Architecture & Structure

- `src/app/` — `layout.tsx` (metadata/OG/fonts/JSON-LD), `page.tsx` +
  `page.module.css` (the home composition), `sitemap.ts`, `robots.ts`,
  `manifest.ts`, `not-found.tsx`
- `src/components/layout/` — `Header`, `MenuOverlay`, `CustomCursor`,
  `SmoothScroll` (Lenis+GSAP), `SkipLink`
- `src/components/sections/<name>/` — `hero`, `intro`, `work`
  (`ProjectList`/`ProjectRow`/`WorkGrid`), `capabilities`, `experience`,
  `contact`. One folder + `.module.css` per section.
- `src/components/ui/` — `MagneticButton`
- `src/components/motion/` — `Reveal`, `SplitText` (GSAP primitives; **available
  but not yet wired into the sections**)
- `src/components/seo/` — `StructuredData.tsx` (Person JSON-LD)
- `src/hooks/` — `useReducedMotion`, `useFinePointer`, `useScrollProgress`
- `src/lib/` — `motion.ts`, `gsap.ts`, `fonts.ts`, `breakpoints.ts`,
  `localTime.ts`, `utils.ts`
- `src/content/` — `site`, `projects`, `about`, `capabilities`, `design` (+
  `src/types/content.ts`)
- `src/styles/` — `tokens.css`, `reset.css`, `typography.css`

**Edit content in `src/content/`, not in components.** Sections are presentation.

## Development Commands

```bash
npm install       # install dependencies
npm run dev       # development server
npm run build     # production build
npm run start     # serve the production build
npm run lint      # next lint
npm run typecheck # tsc --noEmit
npm run format    # prettier --write .
```

## Gotchas

- **The duality is structural.** Signal (blue) = the engineering/build axis;
  Ember (orange) = the design/craft axis. Use one accent moment per viewport, but
  both across the page (e.g. the Capabilities section). BUILD_GUIDE §6.
- **Cursor-driven flourishes are gated behind `useFinePointer`.** The custom
  cursor, magnetic buttons, and the project-list preview follower all fall back
  to plain static UI on touch and under reduced motion.
- Design filenames in `public/design/` contain spaces/parens; `content/design.ts`
  runs them through `encodeURI`.
- Fonts are self-hosted via `next/font/local`; the woff2 in `src/fonts/` are the
  source. Clash Display + General Sans are preloaded (hero-critical).
- `next/font` sets `--font-mono` on `<body>`; that scoped value wins over the
  `:root` fallback in `tokens.css`.

## Known Issues / Follow-ups

Tracked in the design-audit roadmap (see the `portfolio-consolidation` memory):

- **GSAP ships for a rAF loop.** `SmoothScroll` is its only caller
  (`gsap.ticker` + `ScrollTrigger.update`), and the components that justify it —
  `motion/Reveal`, `motion/SplitText` — are imported by nothing. Either wire
  them into the section reveals or drop GSAP for a plain rAF.
- **Project rows promise links they don't have.** Only Unipix has an `href`; the
  other three render as a `<span>` that still shows the `↗`, and are not
  keyboard-reachable.
- **Carousel ghosts in `content/projects.ts`:** `displayTitle`, `tagline`,
  `texture`, `ambient` and `public/showcase/*.jpg` served the deleted R3F
  scene. `ProjectRow` renders `displayTitle`, so the list shows carousel
  shorthand ("Healthcare On-Chain") and the canonical `title` never appears.
- **`MenuOverlay` has no scroll lock or focus return** — Lenis keeps scrolling
  the page behind the open menu, and closing drops focus rather than returning
  it to the toggle. Lenis also isn't wired to hash anchors (`anchors: true`).
- **Copy drift on the title:** `site.tagline` / `headlineTop` say "Frontend
  developer"; metadata, JSON-LD, and the hero say "Fullstack Developer &
  Product Designer".
- **16 hard-coded colours in CSS modules**, against the golden rule — worst in
  `Header.module.css` (hardcoded ink/bone, so the header can't respond to the
  theme flip it sits on) and `Hero.module.css`.
- **No tests**, though Playwright is installed and `content/capabilities.ts`
  advertises RTL/Selenium.
- **Three cursor systems** (`CustomCursor`, the `data-cursor` attributes, and the
  ProjectList preview follower) are not yet unified into one context-aware
  cursor — planned P1.
- **Projects show title + category only.** Metrics, live/repo links, and 1–2 case
  studies are planned; some proof data already sits in `content/about.ts`.
- `motion/Reveal` + `SplitText` are built but **not yet wired** into section
  reveals (see the GSAP note above).
