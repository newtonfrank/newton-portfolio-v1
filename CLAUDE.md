# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js portfolio site for Newton Frank. A single route (`/`) composed of seven
sections, with a light editorial aesthetic.

A full rebuild — codenamed "The Nexus" — is specced under `docs/rebuild/`. That
spec describes a **target**, not the present codebase. Read
`docs/rebuild/BUILD_GUIDE.md` before writing new code, and
`docs/superpowers/plans/` for in-flight plans.

## Current State

The M0 audit (2026-07-09) found the previous version of this file describing
features that did not exist. What follows is verified against the source.

- **No 3D.** There are zero imports of `three` or `@react-three/*`. Those
  packages were removed.
- **No GSAP.** Animation is `framer-motion` only.
- **No global state.** `useSpectrum` (the "Nexus" dev↔design theme spectrum) and
  `useTechStore` were unreachable dead code — no route ever mounted them, and no
  CSS ever responded to the classes they set. Both were deleted.
- **No React Server Components.** Every component is `"use client"`.
- **Nothing on the page is server-rendered.** `page.tsx` wraps all sections in
  `<SmoothScroll>`, which is `dynamic(..., { ssr: false })`. The prerendered HTML
  contains only `<head>`, the grain overlay, and JSON-LD. The hero headline and
  LCP image render after hydration.
- Smooth scroll is `lenis`, via `src/components/ui/smooth-scroll.tsx`.
- Styling is Tailwind CSS v3 plus CSS custom properties in `src/app/globals.css`.

## Architecture & Structure

- `src/app/` — routes, metadata, `globals.css`, `sitemap.ts`, `robots.ts`, `manifest.ts`
- `src/components/sections/` — the seven rendered sections: Hero, About,
  TechnicalProjects, DesignWork, Skills, Contact, Footer
- `src/components/ui/` — `smooth-scroll.tsx` (Lenis provider)
- `src/components/seo/` — `StructuredData.tsx` (JSON-LD)
- `src/content/` — all copy and project data, typed
- `src/types/content.ts` — content types

**Edit content in `src/content/`, not in components.** The sections are
presentation only.

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

## Key Files

- `src/app/page.tsx` — the single route; lazy-loads every section below the hero
- `src/app/layout.tsx` — metadata, OpenGraph, fonts, Analytics, JSON-LD
- `src/app/globals.css` — Tailwind layers + CSS custom properties
- `src/content/*` — projects, design gallery, about, skills, site config

## Gotchas

- **`@fontsource/londrina-solid` and `@fontsource/londrina-outline` look unused
  but are not.** `Hero.tsx` names `"Londrina Solid"` / `"Londrina Outline"` in
  inline `fontFamily` styles rather than importing them. A dependency scan will
  call them dead. They are not.
- Design filenames in `public/design/` contain spaces and parentheses;
  `src/content/design.ts` runs them through `encodeURI`.
- `next.config.js` sets a custom `splitChunks`, which forces a ~176 kB
  `vendor-react` chunk onto every route.

## Known Issues

- **The contact form does not send anything.** `Contact.tsx` `handleSubmit`
  calls `preventDefault()`, sets `sent = true`, and resets after 2.6s. There is
  no fetch, no action, no provider. It reports "Message Sent" and discards the
  message.
- `/` ships ~226 kB First Load JS against the 180 kB budget in
  `docs/rebuild/BUILD_GUIDE.md §8` — before any WebGL or GSAP is added.
- `public/` is ~30 MB. `newton-profile.jpg` is 3.0 MB and is the declared
  1200×630 OG image; `newton-profile.png` is 7.0 MB.
- `DesignWork.tsx` and `TechnicalProjects.tsx` use raw `<img>`, not `next/image`
  (`next lint` warns on all three call sites).
