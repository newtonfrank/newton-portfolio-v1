# M0 · Foundation Cleanup & Content Extraction — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repo an honest, minimal, correctly-documented foundation — accurate `CLAUDE.md`, zero dead code, zero unused dependencies, working lint — with all portfolio content extracted into typed `src/content/` modules ready for the Next 15 rewrite.

**Architecture:** This is the "keep the repo, rewrite `src/`" strategy. We do **not** upgrade Next/React/Tailwind here; that is M1. This plan strips the repo down to the ~970 lines that actually render, lifts the content out of those components into typed data modules, and leaves the existing UI working and building the whole time. Each task ends with a green `tsc --noEmit` and a green `next build`.

**Tech Stack (current, unchanged by this plan):** Next.js 14.2.35 (App Router), React 18.2, TypeScript 5.9 (strict), Tailwind CSS 3.4, framer-motion 12, lenis 1.3, lucide-react.

## Global Constraints

- **No behavior change.** Every task must leave the rendered page byte-for-byte equivalent. Content extraction is a pure refactor: same strings, same order, same image paths.
- **No test framework exists in this repo.** There is no `test` script, no vitest/jest, no test files. Do **not** scaffold one in M0 — that is out of scope and unasked for. The verification cycle for every task is: `./node_modules/.bin/tsc --noEmit` (must exit 0) → `npm run build` (must exit 0) → a task-specific `grep` assertion on the build output or source. Where this plan says "verify," it means run those exact commands and read the output.
- **Do not delete anything reachable.** The reachable set from the App Router entry points (`layout.tsx`, `page.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts`, `manifest.ts`) is exactly: `Hero`, `About`, `TechnicalProjects`, `DesignWork`, `Skills`, `Contact`, `Footer`, `smooth-scroll`, `StructuredData`.
- **`@fontsource/londrina-solid` and `@fontsource/londrina-outline` are load-bearing.** `Hero.tsx` hardcodes `"Londrina Solid"` / `"Londrina Outline"` in inline `fontFamily` styles (lines 38–39, 145, 160). A naive dependency scan will call them unused. They are not. Do not remove them.
- **Path alias:** `@/*` → `./src/*` (already configured in `tsconfig.json`). New content lives at `src/content/`, imported as `@/content/...`.
- **Commit style:** Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`), per `docs/rebuild/BUILD_GUIDE.md §7.2`.
- **Out of scope for M0 (do not do these):** the Next 15 / React 19 upgrade, Tailwind v4, GSAP, the WebGL hero, image re-compression, and fixing the non-functional contact form. Each is tracked in "Deferred" at the bottom.

---

## File Structure

**Modified:**
- `CLAUDE.md` — corrected to describe the codebase that exists (Task 1)
- `package.json` — 19 deps removed, `name` fixed, scripts added (Task 2)
- `next.config.js` — no-op `swcPlugins` and misleading `images.unoptimized` removed (Task 2)
- `src/app/layout.tsx` — remove `.vignette-overlay` div (class is never defined) (Task 2)
- `src/app/globals.css` — remove unused `TungstenCustom` `@font-face` and unused font vars (Task 2)
- `src/components/sections/TechnicalProjects.tsx` — consume `@/content/projects` (Task 3)
- `src/components/sections/DesignWork.tsx` — consume `@/content/design` (Task 3)
- `src/components/sections/About.tsx` — consume `@/content/about` (Task 3)
- `src/components/sections/Skills.tsx` — consume `@/content/skills` (Task 3)
- `src/components/sections/Hero.tsx` — consume `@/content/site` (Task 3)
- `src/components/sections/Footer.tsx` — consume `@/content/site` (Task 3)
- `src/components/sections/Contact.tsx` — consume `@/content/site` (Task 3)

**Created:**
- `src/types/content.ts` — `Project`, `DesignPiece`, `EducationEntry`, `ExperienceEntry`, `SocialLink`, `NavLink`
- `src/content/site.ts` — name, email, location, tagline, nav links, socials
- `src/content/projects.ts` — the 4 technical projects
- `src/content/design.ts` — the 17 design gallery pieces + derived titles
- `src/content/about.ts` — education, experience, achievements
- `src/content/skills.ts` — the 23-item stack list

**Deleted (17 files, ~1,400 lines — all verified unreachable):**
- `src/components/ui/Particles.tsx`, `MagneticWrapper.tsx`, `SpectrumSlider.tsx`, `Preloader.tsx`, `KonamiTerminal.tsx`, `custom-cursor.tsx`, `Navigation.tsx`
- `src/components/sections/Work.tsx`
- `src/components/layout/CyberGrid.tsx` (empties `layout/`)
- `src/components/canvas/HeroObject.tsx` (empties `canvas/`)
- `src/hooks/useScrollTo.ts`, `usePhysicsStore.ts`, `useScrollReveal.ts`, `useIsMobile.ts` (empties `hooks/`)
- `src/store/useTechStore.ts`, `useSpectrum.ts` (empties `store/`)
- `src/lib/utils.ts` (empties `lib/`)
- `eslint.config.js` (leftover Vite flat config)
- `.vercel-final-clean`, `.vercel-fix`, `.vercel-reconnect`, `force-vercel.txt`, `tsconfig.tsbuildinfo` (tracked junk)

---

### Task 1: Correct `CLAUDE.md`

`CLAUDE.md` currently asserts three things that are false, and will mislead every future session until fixed:

1. *"Heavily uses Three.js and @react-three/fiber for 3D visualizations"* — there are **zero** imports of `three` or `@react-three/*` in `src/`. The only canvas file is `src/components/canvas/HeroObject.tsx`, whose entire body is `export function HeroCanvas() { return null; }`.
2. *"The `useSpectrum` store manages a continuous spectrum … with dynamic CSS variable updates"* — `useSpectrum` is imported only by `SpectrumSlider`, `custom-cursor`, and `Navigation`, none of which are rendered by any route. It is unreachable. There are also no CSS rules anywhere for the `.spectrum-dev` / `.spectrum-nexus` / `.spectrum-design` classes it sets on `<html>`.
3. It points at `src/components/ui/SpectrumSlider.ts` — the file is `.tsx` — and lists `Hero, About, Work, Skills, Contact, Footer` as the sections, but `page.tsx` renders `Hero, About, TechnicalProjects, DesignWork, Skills, Contact, Footer`. `Work.tsx` is never imported.

**Files:**
- Modify: `CLAUDE.md` (whole-file rewrite of the Overview / Architecture / State / Key Files sections)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks. Do this first so a fresh agent picking up Task 2 or 3 reads accurate docs.

- [ ] **Step 1: Confirm the three false claims still hold**

```bash
grep -rn "@react-three\|from ['\"]three['\"]" src || echo "CONFIRMED: no three/r3f imports"
cat src/components/canvas/HeroObject.tsx
grep -rn "spectrum-dev\|spectrum-nexus\|spectrum-design" src --include='*.css' || echo "CONFIRMED: no spectrum CSS"
```

Expected: `CONFIRMED: no three/r3f imports`, a 3-line file returning `null`, `CONFIRMED: no spectrum CSS`.

- [ ] **Step 2: Rewrite the inaccurate sections of `CLAUDE.md`**

Replace the **Project Overview**, **Architecture & Structure**, **Key Features & Architecture**, **State Management**, and **Key Files & Components** sections with:

```markdown
## Project Overview

Next.js portfolio for Newton Frank — a single-page marketing site with a light,
editorial aesthetic. A full rebuild ("The Nexus") is planned and specced under
`docs/rebuild/`; the current `src/` is the legacy implementation and is being
replaced. Read `docs/rebuild/BUILD_GUIDE.md` before writing new code.

## Current State (as of M0)

The live site is one route (`/`) composed of seven sections. It is **not** the
architecture described in `docs/rebuild/` — that is the target, not the present.

- No Three.js / WebGL. `three` and `@react-three/*` are not used.
- No GSAP. Animation is `framer-motion` only.
- Smooth scroll is `lenis` via `src/components/ui/smooth-scroll.tsx`.
- Every component is `"use client"`. There are no React Server Components.
- Styling is Tailwind CSS v3 plus CSS custom properties in `src/app/globals.css`.
- Content lives in typed modules under `src/content/`.

## Architecture & Structure

- `src/app/` — routes, metadata, `globals.css`, `sitemap.ts`, `robots.ts`, `manifest.ts`
- `src/components/sections/` — the seven rendered sections
- `src/components/ui/` — `smooth-scroll.tsx` (Lenis provider)
- `src/components/seo/` — `StructuredData.tsx` (JSON-LD)
- `src/content/` — typed content: projects, design gallery, about, skills, site config
- `src/types/` — content types

## State Management

None. There is no global store. `useSpectrum` and `useTechStore` were removed in
M0 as unreachable dead code. Section-local `useState` is the only state.

## Key Files & Components

- `src/app/page.tsx` — the single route; lazy-loads all sections below the hero
- `src/app/layout.tsx` — metadata, OpenGraph, fonts, Analytics, JSON-LD
- `src/app/globals.css` — Tailwind layers + CSS custom properties
- `src/content/*` — all copy and project data; edit content here, not in components
```

Also delete the "Special Considerations" bullets referencing the Konami code Easter egg and the custom cursor — `KonamiTerminal.tsx` and `custom-cursor.tsx` are deleted in Task 2.

- [ ] **Step 3: Verify no stale claims remain**

```bash
grep -in "three.js\|react-three\|useSpectrum\|useTechStore\|Konami\|custom cursor\|SpectrumSlider" CLAUDE.md
```

Expected: no output, **or** only lines that explicitly say these things were removed. Any line still describing them as present is a failure — fix it.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: correct CLAUDE.md to describe the codebase that exists

Removed false claims about Three.js/R3F usage (zero imports) and the
useSpectrum theme system (unreachable dead code)."
```

---

### Task 2: Strip dead code, unused deps, and tracked junk; fix lint

**Files:**
- Delete: the 17 source files + 1 stale config + 5 junk files listed in File Structure
- Modify: `package.json`, `next.config.js`, `src/app/layout.tsx`, `src/app/globals.css`
- Modify: `.gitignore` (add `tsconfig.tsbuildinfo`)

**Interfaces:**
- Consumes: nothing.
- Produces: a `package.json` whose `scripts` block includes `typecheck` and `format`, relied on by Task 3's verification steps.

- [ ] **Step 1: Record the baseline so you can prove nothing broke**

```bash
npm run build 2>&1 | grep -E "^[┌├└│]|First Load JS" | tee /tmp/m0-baseline.txt
```

Expected: `/` at **225 kB** First Load JS, 7 static routes. Keep this file; Step 10 compares against it.

- [ ] **Step 2: Delete the 17 unreachable source files**

```bash
git rm src/components/ui/Particles.tsx \
       src/components/ui/MagneticWrapper.tsx \
       src/components/ui/SpectrumSlider.tsx \
       src/components/ui/Preloader.tsx \
       src/components/ui/KonamiTerminal.tsx \
       src/components/ui/custom-cursor.tsx \
       src/components/ui/Navigation.tsx \
       src/components/sections/Work.tsx \
       src/components/layout/CyberGrid.tsx \
       src/components/canvas/HeroObject.tsx \
       src/hooks/useScrollTo.ts \
       src/hooks/usePhysicsStore.ts \
       src/hooks/useScrollReveal.ts \
       src/hooks/useIsMobile.ts \
       src/store/useTechStore.ts \
       src/store/useSpectrum.ts \
       src/lib/utils.ts
```

`Navigation.tsx` is the only file with a relative import (`./MagneticWrapper`); both go together, so nothing dangles.

- [ ] **Step 3: Verify the deletion broke nothing**

```bash
./node_modules/.bin/tsc --noEmit; echo "tsc: $?"
```

Expected: `tsc: 0`. A non-zero exit means something reachable imported a deleted file — restore it with `git checkout HEAD -- <path>` and re-derive the reachable set before continuing.

- [ ] **Step 4: Remove the 19 now-unused dependencies**

Four of these (`ogl`, `zustand`, `clsx`, `tailwind-merge`) were used *only* by files deleted in Step 2. The other fifteen were already unused. `three`, `zustand`, and the R3F packages are in the target stack — they get reinstalled in M1 at React-19-compatible versions, which the currently-pinned `three@0.182` + `@react-three/drei@9` pair is not.

```bash
npm uninstall \
  three @react-three/fiber @react-three/drei three-mesh-bvh \
  matter-js @types/matter-js poly-decomp \
  @supabase/supabase-js cmdk use-sound \
  react-github-calendar react-icon-cloud react-use-measure \
  mini-svg-data-uri ogl zustand clsx tailwind-merge motion
```

Then remove the now-orphaned `overrides` block from `package.json` (it pins `three-mesh-bvh`, which no longer exists):

```json
"overrides": {
  "three-mesh-bvh": "$three-mesh-bvh"
},
```

`motion` is removed because it is the *successor package name* for `framer-motion` — both were installed, and all 15 consuming files import from `framer-motion`. Migrating to `motion` is an M1 concern.

- [ ] **Step 5: Fix `package.json` name and scripts**

The package is still named after the Vite starter it was scaffolded from. Change:

```json
"name": "vite-react-typescript-starter",
"private": true,
"version": "0.0.0",
```

to:

```json
"name": "newton-portfolio",
"private": true,
"version": "0.1.0",
```

and replace the `scripts` block with (adds `typecheck` and `format`, per `BUILD_GUIDE.md §10.1`):

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "format": "prettier --write ."
}
```

`prettier` is not currently a dependency. Add it:

```bash
npm install -D prettier
```

- [ ] **Step 6: Fix the broken lint**

`npm run lint` currently exits 1 without linting anything:

```
Invalid Options:
- Unknown options: useEslintrc, extensions, resolvePluginsRelativeTo, ...
```

Two independent causes:
1. **ESLint 9 vs. `next lint` from Next 14.** Next 14's `next lint` drives the ESLint 8 `CLIEngine` options that ESLint 9 removed.
2. **Two competing configs.** `.eslintrc.json` (correct, Next's) and `eslint.config.js` (leftover **Vite** flat config — still ignores `dist`, still loads `eslint-plugin-react-refresh`).

There is also a silent version mismatch: `eslint-config-next@16.2.4` against `next@14.2.35`.

Fix by deleting the Vite config and pinning ESLint to the major `next lint` expects:

```bash
git rm eslint.config.js
npm uninstall @eslint/js globals eslint-plugin-react-refresh eslint-plugin-react-hooks typescript-eslint
npm install -D eslint@^8.57.1 eslint-config-next@14.2.35
```

- [ ] **Step 7: Verify lint actually runs now**

```bash
npm run lint; echo "lint: $?"
```

Expected: `lint: 0` and real output (e.g. `✔ No ESLint warnings or errors`), **not** the `Invalid Options:` block. If it still errors, do not paper over it by deleting the `lint` script — report the failure.

- [ ] **Step 8: Remove tracked junk and ignore the build artifact**

```bash
git rm --cached tsconfig.tsbuildinfo
git rm .vercel-final-clean .vercel-fix .vercel-reconnect force-vercel.txt
printf '\n# TS incremental build info\ntsconfig.tsbuildinfo\n' >> .gitignore
```

`.DS_Store` is already ignored. `out/` is already ignored.

- [ ] **Step 9: Clean up `next.config.js`, `layout.tsx`, and `globals.css`**

In `next.config.js`, delete the `experimental` block entirely — `swcPlugins: []` is a no-op that only produces the `⚠ Experiments (use with caution)` build warning:

```js
  experimental: {
    // Enable SWC transforms
    swcPlugins: [],
  },
```

Also fix the images block. The comment claims export mode, but there is no `output: 'export'` anywhere — so `unoptimized: true` is disabling `next/image` optimization for no reason:

```js
  // Optimize images
  images: {
    unoptimized: true, // Disable optimization for export mode
    formats: ['image/webp', 'image/avif'],
  },
```

becomes:

```js
  images: {
    formats: ['image/webp', 'image/avif'],
  },
```

In `src/app/layout.tsx`, remove the `.vignette-overlay` div — the class is referenced but **defined nowhere** in any stylesheet:

```tsx
        <div className="vignette-overlay" />
```

In `src/app/globals.css`, remove the `TungstenCustom` `@font-face` block (lines 5–11) and the three unused font custom properties `--font-hero`, `--font-hero-solid`, `--font-hero-outline`. Nothing references them — `Hero.tsx` hardcodes the Londrina families inline. Then delete the now-unreferenced font file:

```bash
git rm public/font/Tungsten_Bold.ttf
```

- [ ] **Step 10: Verify the build still works and got smaller**

```bash
./node_modules/.bin/tsc --noEmit; echo "tsc: $?"
npm run lint; echo "lint: $?"
npm run build 2>&1 | grep -E "^[┌├└│]|First Load JS"
```

Expected: `tsc: 0`, `lint: 0`, build succeeds with the same 7 routes. First Load JS for `/` should be **≤ 225 kB** (the baseline from Step 1) — dead code was tree-shaken already, so a large drop is not guaranteed, but it must not *increase*. The `⚠ Experiments` warning must be gone.

Confirm the site still renders identically:

```bash
npm run dev
# visit http://localhost:3000 — all 7 sections present, no console errors
```

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: remove dead code, unused deps, and tracked junk

- Delete 17 unreachable source files (~1,400 lines), including the
  entire useSpectrum theme system, which no route ever mounted.
- Remove 19 unused dependencies; drop the orphaned three-mesh-bvh override.
- Fix npm run lint, which exited 1 without linting (ESLint 9 vs next@14
  lint, plus a leftover Vite flat config shadowing .eslintrc.json).
- Rename package from vite-react-typescript-starter; add typecheck/format.
- Drop no-op experimental.swcPlugins and the unexplained
  images.unoptimized (there is no output: 'export')."
```

---

### Task 3: Extract content into typed `src/content/` modules

The four technical projects, seventeen design pieces, education, experience, achievements, the 23-item stack, and every email/social/nav string are hardcoded inside section components. Lifting them out is M5's `content/projects` schema task pulled forward, and it is the one piece of durable value in the legacy `src/` — the rewrite consumes these modules instead of re-typing the copy.

**Files:**
- Create: `src/types/content.ts`, `src/content/site.ts`, `src/content/projects.ts`, `src/content/design.ts`, `src/content/about.ts`, `src/content/skills.ts`
- Modify: `src/components/sections/TechnicalProjects.tsx:7-37`, `DesignWork.tsx:7-32`, `About.tsx:6-44`, `Skills.tsx:5-31`, `Hero.tsx:8-18`, `Footer.tsx:5-9`, `Contact.tsx:37-41`

**Interfaces:**
- Consumes: `package.json` `typecheck` script from Task 2.
- Produces:
  - `src/types/content.ts` exports: `Project`, `DesignPiece`, `EducationEntry`, `ExperienceEntry`, `SocialLink`, `NavLink`
  - `src/content/site.ts` exports: `site: SiteConfig`, `navLinks: NavLink[]`, `socials: SocialLink[]`
  - `src/content/projects.ts` exports: `projects: Project[]`
  - `src/content/design.ts` exports: `designPieces: DesignPiece[]`, `designProjects: DesignProject[]`
  - `src/content/about.ts` exports: `education: EducationEntry[]`, `experience: ExperienceEntry[]`, `achievements: string[]`
  - `src/content/skills.ts` exports: `stack: string[]`

- [ ] **Step 1: Create the content types**

Create `src/types/content.ts`:

```ts
export interface Project {
  title: string;
  description: string;
  /** Path under /public, e.g. "/unipix-screenshot.png" */
  image: string;
  tags: string[];
  /** Live URL, when the project is publicly deployed. */
  href?: string;
}

/** A raw file in /public/design. `file` is unencoded; encode at the usage site. */
export interface DesignPiece {
  file: string;
  width: number;
  height: number;
}

/** A DesignPiece with its derived display title and URL-safe src. */
export interface DesignProject {
  title: string;
  image: string;
  width: number;
  height: number;
}

export interface EducationEntry {
  school: string;
  degree: string;
  date: string;
  note: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  date: string;
  points: string[];
}

export interface SocialLink {
  href: string;
  label: string;
}

export interface NavLink {
  /** In-page anchor, e.g. "#about" */
  href: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  email: string;
  location: string;
  tagline: string;
  headlineTop: string;
  headlineBottom: string;
  heroTech: string[];
}
```

- [ ] **Step 2: Create `src/content/site.ts`**

Strings copied verbatim from `Hero.tsx:8-18,108-111,123,147,162,205,209-212`, `Contact.tsx:38-40`, and `Footer.tsx:5-9`.

```ts
import type { NavLink, SiteConfig, SocialLink } from "@/types/content";

export const site: SiteConfig = {
  name: "Newton Frank",
  email: "newtonfrank@outlook.in",
  location: "Tumkur, Karnataka, India",
  tagline:
    "Frontend developer focused on real-time dashboards, scalable UI systems, and polished user flows.",
  headlineTop: "Frontend Developer",
  headlineBottom: "& Product Designer",
  heroTech: ["React.js", "Next.js", "AWS", "Solidity"],
};

export const navLinks: NavLink[] = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Technical" },
  { href: "#design", label: "Design" },
  { href: "#stack", label: "Skills" },
];

export const socials: SocialLink[] = [
  { href: "https://github.com/newtonfrank", label: "GitHub" },
  { href: "https://linkedin.com/in/newtonfrank", label: "LinkedIn" },
  { href: "mailto:newtonfrank@outlook.in", label: "Email" },
];
```

Note `Hero.tsx`'s `quickLinks` is `[LinkedIn, GitHub]` — the *reverse* order of `socials`' first two, and without the mailto. Derive it in `Hero.tsx` rather than adding a near-duplicate export:

```ts
const quickLinks = [
  socials.find((s) => s.label === "LinkedIn")!,
  socials.find((s) => s.label === "GitHub")!,
];
```

- [ ] **Step 3: Create `src/content/projects.ts`**

Copied verbatim from `TechnicalProjects.tsx:7-37`. Only the first project has a live `href`.

```ts
import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    title: "Unipix - Unified Free Stock Image Search",
    description:
      "Aggregates free images from Pexels, Unsplash, and Pixabay in one search workflow with source redirection for downloads.",
    image: "/unipix-screenshot.png",
    tags: ["React.js", "API Integration", "Scalable Architecture"],
    href: "https://unipix-newton.vercel.app",
  },
  {
    title: "Secure Healthcare Data Sharing with Blockchain",
    description:
      "Built a decentralized healthcare sharing platform on Ethereum with role-based access and smart-contract permission controls.",
    image: "/helthcare-screenshot.png",
    tags: ["Ethereum", "Solidity", "Web3.js", "React"],
  },
  {
    title: "Industrial IoT Live Monitoring Dashboard",
    description:
      "Engineered a real-time IIoT dashboard for machine telemetry, trend overlays, analytics, and alert-focused diagnostics.",
    image: "/IIoT-Dashboard.png",
    tags: ["React.js", "Tailwind CSS", "Realtime Data"],
  },
  {
    title: "Component-Based Client Web Platform",
    description:
      "Implemented reusable React component systems during internship delivery, reducing future implementation time by 25%.",
    image: "/component-based-screenshot.png",
    tags: ["React.js", "Design System", "SEO", "Responsive UI"],
  },
];
```

- [ ] **Step 4: Create `src/content/design.ts`**

The 17 entries are copied verbatim from `DesignWork.tsx:7-25`. The `designProjects` derivation (title padding, `encodeURI`) moves here unchanged from `DesignWork.tsx:27-32` — the filenames contain spaces and parentheses, so `encodeURI` is required.

```ts
import type { DesignPiece, DesignProject } from "@/types/content";

export const designPieces: DesignPiece[] = [
  { file: "design_school copy.jpg", width: 2480, height: 3508 },
  { file: "design_school-2 copy.jpg", width: 2400, height: 2400 },
  { file: "design_school-3.jpg", width: 4800, height: 4800 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51.jpeg", width: 2961, height: 4160 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (1).jpeg", width: 3400, height: 2161 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (2).jpeg", width: 1600, height: 1600 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (3).jpeg", width: 1280, height: 1600 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (4).jpeg", width: 1190, height: 1488 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (5).jpeg", width: 3328, height: 4160 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (6).jpeg", width: 1600, height: 1600 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (7).jpeg", width: 3328, height: 4160 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (8).jpeg", width: 4160, height: 2081 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (9).jpeg", width: 1036, height: 1241 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.51 (10).jpeg", width: 3200, height: 420 },
  { file: "WhatsApp Image 2026-03-12 at 15.12.52.jpeg", width: 2562, height: 424 },
  { file: "WhatsApp Image 2026-03-12 at 15.13.28.jpeg", width: 3400, height: 2161 },
  { file: "WhatsApp Image 2026-03-12 at 15.15.02.jpeg", width: 1280, height: 1600 },
];

export const designProjects: DesignProject[] = designPieces.map((item, index) => ({
  title: `Design Exploration ${String(index + 1).padStart(2, "0")}`,
  image: encodeURI(`/design/${item.file}`),
  width: item.width,
  height: item.height,
}));
```

- [ ] **Step 5: Create `src/content/about.ts` and `src/content/skills.ts`**

`src/content/about.ts` — verbatim from `About.tsx:6-44`:

```ts
import type { EducationEntry, ExperienceEntry } from "@/types/content";

export const education: EducationEntry[] = [
  {
    school: "Sri Siddhartha School of Engineering (SSSE), Tumakuru",
    degree: "B.E. in Computer Science",
    date: "2021 - 2025",
    note: "CGPA: 7.75 / 10",
  },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Frontend Developer Intern",
    company: "Smartchakra Private Limited",
    date: "Feb 2025 - Jun 2025 · Onsite",
    points: [
      "Built an Industrial IoT dashboard for real-time monitoring, historical analysis, and predictive maintenance.",
      "Implemented high-frequency sensor visualization (vibration, temperature, audio) with 10-second auto-refresh.",
      "Shipped analytics, fleet overview, and full CRUD modules for settings and alert management.",
      "Designed intuitive data-rich interfaces for faster diagnostics and maintenance workflows.",
    ],
  },
  {
    role: "Frontend Developer Intern",
    company: "Scyara Group Private Limited",
    date: "May 2023 - Jul 2023 · Remote",
    points: [
      "Developed responsive web applications using React.js and Tailwind CSS for client projects.",
      "Created a component-based design system that reduced future UI implementation time by 25%.",
      "Delivered mobile-first, cross-browser compatible interfaces across multiple websites.",
      "Improved SEO with semantic markup, optimized metadata, and XML sitemap integration.",
    ],
  },
];

export const achievements: string[] = [
  "Founded and led the Programming Club, increasing student hackathon participation by 50%.",
  "Mentored 10+ juniors in web development and placement readiness.",
  "Recognized for teamwork and adaptability during internships and collaborative projects.",
];
```

`src/content/skills.ts` — verbatim from `Skills.tsx:5-29`. Note `marqueeItems` (the `×3` repetition) stays in `Skills.tsx`: it is a presentation detail of the marquee, not content.

```ts
export const stack: string[] = [
  "JavaScript",
  "Python",
  "C",
  "C++",
  "React.js",
  "Next.js",
  "Node.js",
  "Express",
  "REST APIs",
  "MongoDB",
  "MySQL",
  "AWS (EC2, S3)",
  "Docker",
  "CI/CD",
  "Ethereum",
  "Solidity",
  "Web3.js",
  "Selenium",
  "React Testing Library",
  "Figma",
  "Photoshop",
  "Illustrator",
  "Adobe XD",
];
```

- [ ] **Step 6: Verify the content modules typecheck before wiring them up**

```bash
npm run typecheck; echo "tsc: $?"
```

Expected: `tsc: 0`. The modules are not imported yet, but `tsconfig.json`'s `include: ["**/*.ts"]` still typechecks them.

- [ ] **Step 7: Wire each section to its content module**

Delete the local `const` array from each component and import instead. Seven edits, one per file. In each case the JSX below the array is **unchanged**.

`src/components/sections/TechnicalProjects.tsx` — delete lines 7–37, add after the existing imports:

```ts
import { projects } from "@/content/projects";
```

`src/components/sections/DesignWork.tsx` — delete lines 7–32 (both `designFiles` and the `designProjects` map), add:

```ts
import { designProjects } from "@/content/design";
```

Then update the `useState` generic, which currently derives its type from the deleted local array (`(typeof designProjects)[0]`). Import the type explicitly:

```ts
import type { DesignProject } from "@/types/content";
// ...
const [selectedProject, setSelectedProject] = useState<DesignProject | null>(null);
```

`src/components/sections/About.tsx` — delete lines 6–44, add:

```ts
import { achievements, education, experience } from "@/content/about";
```

`src/components/sections/Skills.tsx` — delete lines 5–29 (keep line 31, `marqueeItems`), add:

```ts
import { stack } from "@/content/skills";
```

`src/components/sections/Hero.tsx` — delete lines 8–18, add:

```ts
import { navLinks, site, socials } from "@/content/site";

const quickLinks = [
  socials.find((s) => s.label === "LinkedIn")!,
  socials.find((s) => s.label === "GitHub")!,
];
```

Then replace the hardcoded strings in the JSX with `site` fields: the two `mailto:`/label occurrences at lines 108 and 111 → `site.email`; the tagline at line 123 → `site.tagline`; the four headline occurrences at lines 147, 153, 162, 168 → `site.headlineTop` / `site.headlineBottom` (the visible and the `invisible` sizing copies must use the same value); line 205 → `` {`based in ${site.location}.`} ``; the four `<span>`s at lines 209–212 → `site.heroTech.map(...)`.

`src/components/sections/Footer.tsx` — delete lines 5–9 and map labels to icons locally, since React components cannot live in a content module:

```ts
import { Github, Linkedin, Mail } from "lucide-react";
import { site, socials } from "@/content/site";

const iconFor: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};
```

and in the JSX, replace `social.icon` with a lookup, and hardcoded "Newton Frank" with `site.name`:

```tsx
{socials.map((social) => {
  const Icon = iconFor[social.label];
  return (
    <a
      key={social.label}
      href={social.href}
      target={social.href.startsWith("http") ? "_blank" : undefined}
      rel={social.href.startsWith("http") ? "noreferrer" : undefined}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-[#60A5FA] hover:text-[#60A5FA]"
      aria-label={social.label}
    >
      <Icon size={16} />
    </a>
  );
})}
```

`src/components/sections/Contact.tsx` — replace the hardcoded block at lines 38–40:

```tsx
<p>Email: {site.email}</p>
<p>Location: {site.location}</p>
<p>LinkedIn: linkedin.com/in/newtonfrank</p>
```

with `site.email`, `site.location`, and the LinkedIn href from `socials`, adding:

```ts
import { site, socials } from "@/content/site";
```

- [ ] **Step 8: Verify nothing changed on the page**

```bash
npm run typecheck; echo "tsc: $?"
npm run lint; echo "lint: $?"
npm run build; echo "build: $?"
```

Expected: all three exit `0`.

Now assert the content actually survived into the rendered HTML — a passing build does not prove the strings are on the page:

```bash
grep -c "Design Exploration" out/index.html 2>/dev/null || \
  grep -c "Design Exploration" .next/server/app/index.html
```

Expected: **17**. If it is 0, the design gallery lost its data. Then:

```bash
grep -o "Unipix - Unified Free Stock Image Search" .next/server/app/index.html | head -1
grep -o "newtonfrank@outlook.in" .next/server/app/index.html | head -1
grep -o "Sri Siddhartha School of Engineering" .next/server/app/index.html | head -1
```

Each must print its string. Note `page.tsx` lazy-loads `About`, `TechnicalProjects`, and `DesignWork` with `ssr: false`, so these may not appear in the *server* HTML — if so, verify in the browser instead:

```bash
npm run dev
# http://localhost:3000 — confirm: 4 project cards, 17 design tiles,
# 2 experience entries, 23 skill chips, footer email, no console errors.
```

- [ ] **Step 9: Confirm no content strings remain hardcoded in components**

```bash
grep -rn "newtonfrank@outlook.in\|Sri Siddhartha\|Unipix\|design_school" src/components/ \
  && echo "FAIL: content still hardcoded in components" \
  || echo "PASS: components are content-free"
```

Expected: `PASS`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "refactor: extract portfolio content into typed src/content modules

Projects, design gallery, education, experience, achievements, skills,
and site config now live in src/content/ behind types in src/types/content.ts.
Sections consume them as props-free imports. No rendered output changes.

Pulls M5's content schema forward so the Next 15 rewrite has real content
to build against."
```

---

## Deferred (explicitly out of scope for M0)

These were found during the M0 audit. They are real and should be tracked, but each belongs to a later milestone:

| Finding | Evidence | Milestone |
|---|---|---|
| **Contact form is non-functional** | `Contact.tsx:10-14` — `handleSubmit` sets `sent = true` and never sends. No fetch, no action, no provider. It reports "Message Sent" and discards the message. | M4 (`TASKS.md` → "Contact form (working + spam-guarded)") |
| `/` ships **225 kB** First Load JS vs. the 180 kB budget — before any WebGL or GSAP | `next build` output; `vendor-react` chunk alone is 176 kB, forced onto every route by the custom `splitChunks` in `next.config.js` | M9 (Performance) |
| `public/` is **30 MB**. `newton-profile.png` is **3.0 MB** and is the declared 1200×630 OG image; `newton-profile.png` is 7.0 MB | `du -sh public` | M9 (Performance) |
| Every one of the 22 components is `"use client"`; zero RSC | `grep -rl '"use client"' src` returns 22 of 22 `.tsx` | M1–M2 (rewrite) |
| `DesignWork` uses raw `<img>`, not `next/image` | `DesignWork.tsx:111,164` | M5 |
| Design filenames contain spaces and `WhatsApp Image ...` timestamps | `public/design/` | M5 (rename on migration) |
| `eslint-config-next@16.2.4` vs `next@14.2.35` | `package.json` | Resolved in Task 2; revisit on the Next 15 upgrade |

---

## Self-Review

**Spec coverage.** The four steps requested: (1) written plan — this document; (2) fix `CLAUDE.md` — Task 1; (3) cleanup commit — Task 2; (4) extract content — Task 3. All covered.

**Placeholder scan.** No `TBD`, no "handle edge cases," no "similar to Task N." Every code step shows the code. Every command shows its expected output.

**Type consistency.** `DesignProject` is defined in `src/types/content.ts` (Task 3, Step 1) and consumed by both `src/content/design.ts` (Step 4) and `DesignWork.tsx`'s `useState` generic (Step 7) under that exact name. `SiteConfig` fields (`name`, `email`, `location`, `tagline`, `headlineTop`, `headlineBottom`, `heroTech`) are defined in Step 1 and every field is consumed in Step 7. `socials` is `SocialLink[]` in both `site.ts` and `Footer.tsx`'s `iconFor` lookup, keyed on `label`.

**Known deviation from the writing-plans skill.** The skill prescribes a TDD cycle (write failing test → run → implement → pass). This repo has **no test framework, no test script, and no test files**, and standing one up is outside what was asked for M0. Rather than fabricate `pytest`-shaped steps that no one can run, every task here uses the repo's real verification cycle — `tsc --noEmit`, `next lint`, `next build`, plus `grep` assertions against build output and source. Task 3 is a pure refactor whose correctness criterion is "the rendered output is unchanged," which those checks and the dev-server confirmation in Step 8 do establish. A test harness belongs in M1, alongside the primitives it would cover.
